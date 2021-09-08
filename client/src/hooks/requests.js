const PROTOCOL = 'http://'
const URL = 'localhost'
const PORT = ':8000'
const BASE_URL = PROTOCOL + URL + PORT

async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`)
  return response.json()

}

async function httpGetLaunches() {
  const response = await fetch(`${BASE_URL}/launches`);
  const fetchedLaunches = response.json();
  return fetchedLaunches
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${BASE_URL}/launches`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "post",
    body: JSON.stringify(launch)
  });
  } catch (e) {
    return { ok: false };
  }

};

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};