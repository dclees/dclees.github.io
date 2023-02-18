const power_secret_id = "power_secret";

const userBtnClick = () => {
  const userID = document.getElementById("userID");
  console.log("User button clicked");

  const userIDvalue = userID.value;
  console.log("User id: ", userIDvalue);
  localStorage.setItem(power_secret_id, userIDvalue);
  userID.value = "";
  console.log("User ID stored locally");
  getLatestPower();
};

// Handle return key on label/userID
const userID = document.getElementById("userID"); // add key listener
userID.addEventListener("keypress", (e) => {
  // console.log('Key press:', e.key);
  if (e.key == "Enter") {
    // console.log('Enter key');
    userBtnClick();
  }
});

const displayLatestPower = (powerNow, energyToday, date) => {
  const elPower = document.getElementById("PowerNow");
  const elEnergy = document.getElementById("EnergyToday");
  const elPowerDate = document.getElementById("PowerDate");
  const elNow = document.getElementById("DateTimeNow");

  elPower.innerText = powerNow.toString();
  elEnergy.innerText = (energyToday / 1000).toString();
  elPowerDate.innerText = date.toLocaleString();
  elNow.innerText = new Date().toLocaleString();
};

const getLatestPower = async () => {
  console.log("Fetching power data");
  const secret = localStorage.getItem(power_secret_id);
  if (secret == null) {
    console.log("Missing local ID");
    return;
  }

  const baseurl =
    "https://eu-west-1.aws.data.mongodb-api.com/app/powerstats-ikmbx/endpoint";
  const latestPower = "/Latest";
  const url = baseurl + latestPower + "?secret=" + secret;

  fetch(url)
    .then((resp) => {
      if (resp.ok && resp.status == 200) {
        return resp.json();
      }
      console.log("Bad status: ", resp.status);
      throw Error(resp.statusText);
    })
    .then((json) => {
      //   console.log("JSON: ", json, typeof json);
      if (Array.isArray(json)) {
        if (json.length >= 1) json = json[0];
      }
      try {
        // console.log('Power: ', json);
        const { powerNow = 0, energyToday = 0 } = json;
        const {
          year = 0,
          month = 0,
          day = 0,
          hour = 0,
          mins = 0,
          secs = 0,
        } = json;
        const date = new Date(year, month - 1, day, hour, mins, secs);

        displayLatestPower(powerNow, energyToday, date);
        console.log(`Power data updated: ${hour}:${mins}:${secs}`);
      } catch (error) {
        console.log("Bad power object returned:", error);
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

getLatestPower();
setInterval(() => {
  getLatestPower();
}, 30 * 1000);
