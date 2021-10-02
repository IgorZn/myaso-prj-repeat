const PROTOCOL = 'http://'
const URL = 'localhost'
const PORT = ':8000'
const API_VER = '/v1'
const BASE_URL = PROTOCOL + URL + PORT + API_VER

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
  try {
    return await fetch(`${BASE_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (e) {
    console.log(e)
    return { ok: false };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};