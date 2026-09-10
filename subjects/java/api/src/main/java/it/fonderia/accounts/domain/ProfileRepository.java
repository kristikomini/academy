package it.fonderia.accounts.domain;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    /**
     * The leaderboard: the top fifty who have not opted out.
     *
     * <p>A join rather than a display name copied onto the profile, because a learner
     * renaming themselves should not require touching their progress row. The index on
     * {@code xp DESC} is what keeps this cheap — an ordering query with no index behind it
     * is a sort of the whole table.
     */
    @Query("""
        select p, u.displayName, u.id
        from Profile p join UserAccount u on u.id = p.userId
        where u.showOnLeaderboard = true
        order by p.xp desc
        """)
    List<Object[]> leaderboard(Limit limit);
}
