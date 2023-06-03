import Gutter from "./Gutter";
import "./Primordia.scss"

import { usePrimordia } from "../hooks/usePrimordia";
import { useState } from "react";


const Primordia = () => {
  const { primordiaWeapons, primordiaBlood, primordiaTickets } = usePrimordia();
  const [weaponCounts, setWeaponCounts] = useState([0,0,0,0,0,0,0,0,0,0,0]);
  const [selectedWeapon, setSelectedWeapon] = useState({})
  const [selectedWeapons, setSelectedWeapons] = useState([]);


  function incrementCount(weaponId) {
    const newCounts = [...weaponCounts];
    if (newCounts[weaponId] < 5 ){
      newCounts[weaponId] += 1;
      setWeaponCounts(newCounts);
      const incrementedWeapon = primordiaWeapons.find(({ id })=> id === weaponId);
      setSelectedWeapon(incrementedWeapon)
      setSelectedWeapons(prevSelectedWeapons => [...prevSelectedWeapons, incrementedWeapon]);
    }
  }

  function decrementCount(weaponId) {
    const newCounts = [...weaponCounts];
    if (newCounts[weaponId] > 0){
      newCounts[weaponId] -= 1;
      setWeaponCounts(newCounts);
      const decrementedWeapon = primordiaWeapons.find(({ id })=> id === weaponId);
      console.log(decrementedWeapon.image)
      setSelectedWeapon(decrementedWeapon)
    }
  }

  return (
    <div className="container">
      <section className="welcome-section section">
          <h1 className="faq-title heading">
            Weapon training
          </h1>
          <div className="columns den-info is-vcentered">
            <div className="column is-8">
              <p>
                Perform weapon training with your weapons.<br/>
                One weapon = one blood, or save your weapons<br/>
                to re-roll on our upcoming expansion collection.<br/>
                The maximum amount of weapons per transaction is 5
              </p>
              <div className="columns weapon-image-container">
                {primordiaWeapons.map(weapon =>(
                  <div className="column training-weapon is-centered">
                    <img className="weapon-image" src={weapon.image} alt='weapon'/>
                    <div className="weapon-counter">{weaponCounts[weapon.id]}</div>                    
                    <figcaption className="add-remove-button">
                    <span className="add-button" onClick={() => incrementCount(weapon.id)}>+</span>
                      <span className="remove-button" onClick={() => decrementCount(weapon.id)}>&nbsp;-</span> 
                    </figcaption>
                  </div>
                ))}
              </div>
            </div>
            <div className="column is-4 col-right ">
              <div className="selected-weapons-container">
                {selectedWeapons.map((weapon, index) => (
                  <>
                    <img className={`selected-weapon-image weapon-${index + 1}`} src={selectedWeapon.image} alt='weapon'/>
                    <div className={`selected-weapon-image weapon-${index + 1} burn-counter`}>{index + 1}</div>       
                  </>             
                ))}
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
                What sort of utility can I expect from my soulbound trophy?
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

export default Primordia;
