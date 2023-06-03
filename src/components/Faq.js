import "./Faq.css";

import bronzeTrophy from "../assets/trophy1.png";
import silverTrophy from "../assets/trophy2.png";
import goldTrophy from "../assets/trophy3.png";
import diamondTrophy from "../assets/trophy4.png";

import star from "../assets/star.png";

import Gutter from "./Gutter";

// import roadmapBg from '../assets/roadmap-bg.png';

const Faq = () => {
  return (
    <div className="container">
      <section className="welcome-section section">
        <div className="container text-container">
          <h1 className="faq-title heading">
            Welcome back brave moonrunners
          </h1>
          <div className="columns den-info">
            <div className="column">
              <h2 className="heading">THE DEN</h2>
              <p>
                The Den is your new home on Primordia, a space where all new
                features will be announced and ancient lore will be revealed.
                <br /> A living, breathing, organism that is constantly
                expanding and introducing new value to both veteran Moonrunners
                and new recruits.
              </p>
            </div>
            <div className="column col-right">
              <h2 className="heading">PLEDGE TO PRIMORDIA</h2>
              <p>
                Moonrunners was built on doing shit differently. That’s why
                we’re introducing the Soulbound NFTs staking rewards system.
                Simply stake your Moonrunner to Primordia in The Den and earn
                rewards, win prizes, and unlock future utility. The Soulbound
                staking system is how we plan to grow the ecosystem into a more
                interactive and value-driven experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="trophy-section section">
        <div className="container text-container">
          <div className="columns">
            <div className="column">
              <h2 className="heading">Trophy System</h2>
              <p>
                What’s a trophy and how do I get one? Trophies are achievements
                you can earn by staking your Moonrunner and creating a
                Soulbound. These trophies stay in your wallet as a claimable
                NFT. They cannot be traded as they are Soulbound to your wallet
                address. Trophies create more utility, more access, better
                value, and reward loyal Moonrunners - AWWOOOO.
              </p>
            </div>
            <div className="column col-right">
              <h2 className="heading">The Trophies</h2>
              <p>
                Bronze <br />
                Silver
                <br />
                Gold
                <br />
                Diamond <br />
                Wolf of Fame
                <br />
                <br />
                Rewards of the soulbounds do not stack.
              </p>
            </div>
          </div>

          <div className="container columns is-centered  is-vcentered trophy-img-wrapper">
            <div className="column is-2 trophy-row">
              <img alt='trophy-star' src={star} className="trophy-image" id="" />
              <div className="trophy-title" id="wolfTrophy">
                wolf of fame
              </div>
            </div>
            <div className="column is-2  trophy-row">
              <img alt='trophy-bronze' src={bronzeTrophy} className="trophy-image" id="" />
              <div className="trophy-title" id="bronzeTrophy">
                bronze
              </div>
            </div>
            <div className="column is-2  trophy-row">
              <img alt='trophy-silver' src={silverTrophy} className="trophy-image" id="" />
              <div className="trophy-title" id="silverTrophy">
                silver
              </div>
            </div>
            <div className="column is-2  trophy-row">
              <img alt='trophy-gold' src={goldTrophy} className="trophy-image" id="" />
              <div className="trophy-title" id="goldTrophy">
                gold
              </div>
            </div>
            <div className="column is-2  trophy-row">
              <img  alt='trophy-diamond'src={diamondTrophy} className="trophy-image" id="" />
              <div className="trophy-title" id="diamondTrophy">
                
                diamond
              </div>
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column has-text-centered">
              Bronze is acquired by staking 1 Moonrunner for 30 days <br />
              Silver is acquired by staking 5 Moonrunners for 30 days <br />
              Gold is acquired by staking 10 Moonrunners for 30 days <br />
              Diamond is acquired by staking 25 Moonrunners for 30 days
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column has-text-centered">
              The Wolf of Fame is selected by the team to show appreciation for
              notable community members who exceed expectations. These will be
              airdropped, and cannot be traded. You will also receive Discord
              status.
            </div>
          </div>
        </div>
      </section>

      <section className="reminder-section section">
        <div className="container text-container">
          <div className="columns">
            <div className="column">
              <h2 className="heading"> Don’t forget! </h2>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <div>
                To maintain the benefits of your Soulbound trophy, you will need
                the trophy and the number of staked runners the trophy
                represents. For example, if you earn a gold trophy after staking
                10 Moonrunners for 30 days, but then un-stake 2 of your
                Moonrunners, your gold trophy will become void and you will have
                to claim a lower tier trophy to be eligible for its benefits.
                This applies to other utilities, including participation in our
                raffle system, using your Soulbound for discounts on future
                Moonrunners drops and more.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="questions-section section">
        <div className="container text-container">
          <div className="columns is-centered">
            <div className="column">
              <h2 className="heading">
                If I unlock a Silver Soulbound Trophy, then purchase and stake
                more, do I need to wait another 30 days?
              </h2>
            </div>
          </div>
          <div className="columns is-centered">
            <div className="column">
              <div>
                No - if you keep your other Moonrunners staked, and purchase
                enough to stake the additional requirement after your 30 days is
                complete, you will automatically move up to the next tier.
              </div>
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column">
              <h2 className="heading">
                What sort of utility can I expect from my soulbound trophy?{" "}
              </h2>
            </div>
          </div>
          <div className="columns is-centered">
            <div className="column">
              <div>
                Holding a Soulbound trophy and NFT, will give you access to all
                surprise raffles in The Den. If you have a higher level
                Soulbound trophy, you will be eligible for exclusive raffles and
                a chance to win valuable NFTs and assets. Raffles will be held
                regularly, and each will correspond to the level of trophy you
                hold. By holding the trophy, you can enter for a chance to win.
                Trophies will also give you discounts off future collection
                mints. By holding a trophy, you can mint a future Moonrunners
                item at a lower cost. The higher the trophy tier, the greater
                the discount. Discount percentages will be unveiled prior to our
                next mint (expansion collection). Soulbounds will be integrated
                into our upcoming game, future NFT projects and ecosystems to
                provide value and exclusivity.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Gutter />
    </div>
  );
};

export default Faq;
