document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: form.get("username"),
      password: form.get("password"),
    }),
  };

  const response = await fetch("/users/login", options);
  const data = await response.json();

  if (response.status == 200 && data.authorized === true) {
    window.location.assign("/homepage");
  } else {
    console.log(data.error);
  }
});

async function checkLogin() {
  if (!document.cookie) {
    return;
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch("/users/ping", options);
  const data = await response.json();
  console.log(data)
  if (data.status === "authorized") {
    window.location.assign("/homepage");
  }
}

checkLogin();
