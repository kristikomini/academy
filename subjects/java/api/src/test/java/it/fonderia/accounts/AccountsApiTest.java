package it.fonderia.accounts;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.fonderia.accounts.security.RateLimitFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * The blueprint's §5.6 assertion list, plus the happy paths.
 *
 * <p>Against a <b>real relational engine</b> — H2 in memory, running the real
 * {@code schema.sql}. Not a fake in-memory provider, which is not a database and happily
 * passes tests that fail against anything you would deploy.
 *
 * <p>{@code @SpringBootTest} rather than slices, deliberately and against the usual rule:
 * most of what is under test here is <em>filter behaviour</em> — ordering, the 401 that
 * never reaches a controller, the rate limiter — and a web slice does not have the filter
 * chain. The thing being tested is the whole pipeline, so the test boots the whole
 * pipeline.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AccountsApiTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;
    @Autowired private RateLimitFilter rateLimiter;

    private int seq;

    @BeforeEach
    void setUp() {
        /* The limiter's counters are process-wide and the test methods share a context,
           so without this the twentieth sign-in in the class fails for the wrong reason. */
        rateLimiter.reset();
        seq++;
    }

    private String uniqueUsername() {
        return "learner" + System.nanoTime() + seq;
    }

    private record Session(String username, String access, String refresh, String recoveryCode) {
    }

    private Session register() throws Exception {
        String username = uniqueUsername();
        MvcResult result = mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"username":"%s","displayName":"Kristi","password":"correct-horse-battery"}"""
                    .formatted(username)))
            .andExpect(status().isCreated())
            .andReturn();

        var body = json.readTree(result.getResponse().getContentAsString());
        return new Session(username, body.get("accessToken").asText(),
            body.get("refreshToken").asText(), body.get("recoveryCode").asText());
    }

    /* ------------------------------------------------------------------- register */

    @Nested
    @DisplayName("registration and sign-in")
    class Registration {

        @Test
        @DisplayName("registering returns a token pair and the one-time recovery code")
        void registerReturnsEverything() throws Exception {
            Session session = register();

            assertFalse(session.access().isBlank());
            assertFalse(session.refresh().isBlank());
            // 20 characters of Crockford base32 in groups of five.
            assertTrue(session.recoveryCode().matches("[0-9A-HJKMNP-TV-Z]{5}(-[0-9A-HJKMNP-TV-Z]{5}){3}"),
                session.recoveryCode());
        }

        @Test
        @DisplayName("the recovery code is never returned again")
        void recoveryCodeIsShownOnce() throws Exception {
            Session session = register();

            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","password":"correct-horse-battery"}""".formatted(session.username())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recoveryCode").doesNotExist());
        }

        @Test
        @DisplayName("a taken username is a 409")
        void duplicateUsernameIs409() throws Exception {
            Session session = register();

            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","password":"another-long-password"}""".formatted(session.username())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("username-taken"));
        }

        @Test
        @DisplayName("a short password is refused")
        void shortPasswordIsRefused() throws Exception {
            mvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","password":"short"}""".formatted(uniqueUsername())))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("a wrong password and an unknown account produce the SAME message")
        void loginIsNotAnEnumerationOracle() throws Exception {
            Session session = register();

            String wrongPassword = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","password":"not-the-right-password"}""".formatted(session.username())))
                .andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();

            String unknownAccount = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"nobody-at-all","password":"not-the-right-password"}"""))
                .andExpect(status().isUnauthorized())
                .andReturn().getResponse().getContentAsString();

            // Same status, same title, same detail. Only the traceId differs.
            var a = json.readTree(wrongPassword);
            var b = json.readTree(unknownAccount);
            assertEquals(a.get("title"), b.get("title"));
            assertEquals(a.get("detail"), b.get("detail"));
            assertEquals(a.get("status"), b.get("status"));
        }
    }

    /* --------------------------------------------------------------------- tokens */

    @Nested
    @DisplayName("tokens")
    class Tokens {

        @Test
        @DisplayName("a forged signature is rejected")
        void forgedTokenIsRejected() throws Exception {
            Session session = register();

            /* Flip a character in the middle of the signature, not the last one.
             *
             * A 32-byte HMAC is 43 base64url characters, and the final character carries
             * only two significant bits — several different characters decode to the same
             * bytes. Tampering with it therefore often produces a token that is still
             * valid, which is a confusing test failure and a genuinely interesting fact
             * about base64. */
            String[] parts = session.access().split(java.util.regex.Pattern.quote("."));
            char[] signature = parts[2].toCharArray();
            signature[0] = signature[0] == 'A' ? 'B' : 'A';
            String forged = parts[0] + "." + parts[1] + "." + new String(signature);

            mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + forged))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("no token at all is a 401, not a 500")
        void missingTokenIs401() throws Exception {
            mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("refreshing rotates the pair")
        void refreshRotates() throws Exception {
            Session session = register();

            MvcResult result = mvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"refreshToken":"%s"}""".formatted(session.refresh())))
                .andExpect(status().isOk())
                .andReturn();

            String rotated = json.readTree(result.getResponse().getContentAsString())
                .get("refreshToken").asText();
            assertNotEquals(session.refresh(), rotated);
        }

        @Test
        @DisplayName("a used refresh token cannot be replayed, and replaying it kills the family")
        void replayRevokesTheFamily() throws Exception {
            Session session = register();

            MvcResult first = mvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"refreshToken":"%s"}""".formatted(session.refresh())))
                .andExpect(status().isOk()).andReturn();
            String rotated = json.readTree(first.getResponse().getContentAsString())
                .get("refreshToken").asText();

            // Replay the original.
            mvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"refreshToken":"%s"}""".formatted(session.refresh())))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.title").value("token-replayed"));

            // And the token that WAS valid is now dead too — the whole family went.
            mvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"refreshToken":"%s"}""".formatted(rotated)))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("logging out revokes that token")
        void logoutRevokes() throws Exception {
            Session session = register();

            mvc.perform(post("/api/auth/logout")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"refreshToken":"%s"}""".formatted(session.refresh())))
                .andExpect(status().isNoContent());

            mvc.perform(post("/api/auth/refresh")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"refreshToken":"%s"}""".formatted(session.refresh())))
                .andExpect(status().isUnauthorized());
        }
    }

    /* -------------------------------------------------------------------- profile */

    @Nested
    @DisplayName("the progress document")
    class Profiles {

        @Test
        @DisplayName("no document yet is a 204 with an empty body")
        void emptyProfileIs204() throws Exception {
            Session session = register();

            mvc.perform(get("/api/profile").header("Authorization", "Bearer " + session.access()))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));
        }

        @Test
        @DisplayName("a stored document comes back with revision 1")
        void storeAndRead() throws Exception {
            Session session = register();

            mvc.perform(put("/api/profile")
                    .header("Authorization", "Bearer " + session.access())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":{"xp":120},"updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.revision").value(1))
                .andExpect(jsonPath("$.data.xp").value(120));

            mvc.perform(get("/api/profile").header("Authorization", "Bearer " + session.access()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.revision").value(1));
        }

        @Test
        @DisplayName("a stale baseRevision is a 409 CARRYING the current document")
        void staleRevisionCarriesTheCurrentDocument() throws Exception {
            Session session = register();
            String auth = "Bearer " + session.access();

            mvc.perform(put("/api/profile").header("Authorization", auth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":{"xp":10},"updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
                .andExpect(status().isOk());

            // A second device that still thinks it is on revision 0.
            mvc.perform(put("/api/profile").header("Authorization", auth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":{"xp":99},"updatedAt":"2026-03-14T10:00:00Z","baseRevision":0}"""))
                .andExpect(status().isConflict())
                // The winner's document, so the loser can merge without a second request.
                .andExpect(jsonPath("$.revision").value(1))
                .andExpect(jsonPath("$.data.xp").value(10));
        }

        @Test
        @DisplayName("one learner cannot read another's profile")
        void profilesAreNotShared() throws Exception {
            Session alice = register();
            Session bob = register();

            mvc.perform(put("/api/profile").header("Authorization", "Bearer " + alice.access())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":{"xp":500},"updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
                .andExpect(status().isOk());

            // Bob's token gets Bob's profile, which does not exist. There is no id in the
            // request to tamper with — the identity comes from the token.
            mvc.perform(get("/api/profile").header("Authorization", "Bearer " + bob.access()))
                .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName("a malformed document produces zeroes, not a 500")
        void malformedDocumentIsNotAnError() throws Exception {
            Session session = register();

            // Every field the wrong type, and one missing entirely.
            mvc.perform(put("/api/profile").header("Authorization", "Bearer " + session.access())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":{"xp":"lots","chapters":"none","streak":42},
                         "updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.revision").value(1));

            mvc.perform(get("/api/leaderboard").header("Authorization", "Bearer " + session.access()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.isYou == true)].xp").value(org.hamcrest.Matchers.hasItem(0)));
        }

        @Test
        @DisplayName("a hand-edited profile cannot inflate mastery past 100")
        void masteryCannotBeInflated() throws Exception {
            Session session = register();

            mvc.perform(put("/api/profile").header("Authorization", "Bearer " + session.access())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":{"xp":9,"masteryPercent":9999,"chapters":{}},
                         "updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
                .andExpect(status().isOk());

            mvc.perform(get("/api/leaderboard").header("Authorization", "Bearer " + session.access()))
                .andExpect(status().isOk())
                // The server derived it from the chapter count; the claimed 9999 was ignored.
                .andExpect(jsonPath("$[?(@.isYou == true)].masteryPercent")
                    .value(org.hamcrest.Matchers.hasItem(0.0)));
        }

        @Test
        @DisplayName("a non-object document is a 400")
        void nonObjectDocumentIs400() throws Exception {
            Session session = register();

            mvc.perform(put("/api/profile").header("Authorization", "Bearer " + session.access())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"data":[1,2,3],"updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
                .andExpect(status().isBadRequest());
        }
    }

    /* -------------------------------------------------------------------- recovery */

    @Nested
    @DisplayName("password recovery")
    class Recovery {

        @Test
        @DisplayName("the recovery code buys a ticket, and the ticket sets a new password")
        void theWholeRecoveryFlow() throws Exception {
            Session session = register();

            MvcResult ticketResult = mvc.perform(post("/api/auth/forgot-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","recoveryCode":"%s"}"""
                        .formatted(session.username(), session.recoveryCode())))
                .andExpect(status().isOk()).andReturn();

            String ticket = json.readTree(ticketResult.getResponse().getContentAsString())
                .get("resetToken").asText();

            MvcResult reset = mvc.perform(post("/api/auth/reset-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"resetToken":"%s","newPassword":"a-brand-new-password"}""".formatted(ticket)))
                .andExpect(status().isOk())
                // A completed reset returns a FRESH code: the old one was spent.
                .andExpect(jsonPath("$.recoveryCode").isNotEmpty())
                .andReturn();

            String freshCode = json.readTree(reset.getResponse().getContentAsString())
                .get("recoveryCode").asText();
            assertNotEquals(session.recoveryCode(), freshCode);

            // The new password works.
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","password":"a-brand-new-password"}""".formatted(session.username())))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("the recovery code is normalised forgivingly")
        void codeNormalisationIsForgiving() throws Exception {
            Session session = register();
            // Lower case, spaces instead of dashes — as somebody would copy it off paper.
            String awkward = session.recoveryCode().toLowerCase().replace('-', ' ');

            mvc.perform(post("/api/auth/forgot-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","recoveryCode":"%s"}"""
                        .formatted(session.username(), awkward)))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("a ticket cannot be spent twice")
        void ticketIsSingleUse() throws Exception {
            Session session = register();

            MvcResult ticketResult = mvc.perform(post("/api/auth/forgot-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","recoveryCode":"%s"}"""
                        .formatted(session.username(), session.recoveryCode())))
                .andReturn();
            String ticket = json.readTree(ticketResult.getResponse().getContentAsString())
                .get("resetToken").asText();

            mvc.perform(post("/api/auth/reset-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"resetToken":"%s","newPassword":"first-new-password"}""".formatted(ticket)))
                .andExpect(status().isOk());

            mvc.perform(post("/api/auth/reset-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"resetToken":"%s","newPassword":"second-new-password"}""".formatted(ticket)))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("a wrong recovery code and an unknown account are indistinguishable")
        void recoveryIsNotAnEnumerationOracle() throws Exception {
            Session session = register();

            String wrongCode = mvc.perform(post("/api/auth/forgot-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"%s","recoveryCode":"AAAAA-AAAAA-AAAAA-AAAAA"}"""
                        .formatted(session.username())))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();

            String unknown = mvc.perform(post("/api/auth/forgot-password")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"nobody-here","recoveryCode":"AAAAA-AAAAA-AAAAA-AAAAA"}"""))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();

            assertEquals(json.readTree(wrongCode).get("detail"), json.readTree(unknown).get("detail"));
        }
    }

    /* ---------------------------------------------------------------- the pipeline */

    @Nested
    @DisplayName("the filter pipeline")
    class Pipeline {

        @Test
        @DisplayName("/api/health is anonymous and does not touch the database")
        void healthIsAnonymous() throws Exception {
            mvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
        }

        @Test
        @DisplayName("an unknown path is a 404, not a 401")
        void unknownPathIs404() throws Exception {
            mvc.perform(get("/nothing-here")).andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("the rate limiter throttles repeated sign-ins")
        void rateLimiterThrottlesAuth() throws Exception {
            rateLimiter.reset();
            // The limit is 10/minute. The eleventh is refused.
            for (int i = 0; i < 10; i++) {
                mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"nobody","password":"whatever-long-enough"}"""));
            }
            mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"username":"nobody","password":"whatever-long-enough"}"""))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"));
        }

        @Test
        @DisplayName("and leaves /api/health alone")
        void rateLimiterLeavesHealthAlone() throws Exception {
            rateLimiter.reset();
            for (int i = 0; i < 30; i++) {
                mvc.perform(get("/api/health")).andExpect(status().isOk());
            }
        }
    }

    /* -------------------------------------------------------------- the whole loop */

    @Test
    @DisplayName("two devices, one account: the second one merges rather than overwriting")
    void twoDeviceSync() throws Exception {
        Session phone = register();
        String auth = "Bearer " + phone.access();

        // The phone syncs first.
        mvc.perform(put("/api/profile").header("Authorization", auth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"data":{"xp":100},"updatedAt":"2026-03-14T09:00:00Z","baseRevision":0}"""))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.revision").value(1));

        // The laptop still holds revision 0 and is refused, with the phone's document.
        MvcResult conflict = mvc.perform(put("/api/profile").header("Authorization", auth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"data":{"xp":40},"updatedAt":"2026-03-14T08:00:00Z","baseRevision":0}"""))
            .andExpect(status().isConflict()).andReturn();

        int currentRevision = json.readTree(conflict.getResponse().getContentAsString())
            .get("revision").asInt();

        // Having merged, it writes against the revision it was given, and wins.
        mvc.perform(put("/api/profile").header("Authorization", auth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"data":{"xp":140},"updatedAt":"2026-03-14T09:30:00Z","baseRevision":%d}"""
                    .formatted(currentRevision)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.revision").value(2))
            .andExpect(jsonPath("$.data.xp").value(140));
    }

    @Test
    @DisplayName("deleting the account takes the profile and the sessions with it")
    void deleteAccountCascades() throws Exception {
        Session session = register();
        String auth = "Bearer " + session.access();

        mvc.perform(put("/api/profile").header("Authorization", auth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"data":{"xp":10},"updatedAt":"2026-03-14T09:15:00Z","baseRevision":0}"""))
            .andExpect(status().isOk());

        mvc.perform(delete("/api/me").header("Authorization", auth))
            .andExpect(status().isNoContent());

        // The refresh token went with the account: no session outlives its owner.
        mvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"refreshToken":"%s"}""".formatted(session.refresh())))
            .andExpect(status().isUnauthorized());
    }
}
