import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [isAuthentic, setIsAuthentic] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [breed, setBreed] = useState("");
  let dogIds;
  const [dogs, setDogs] = useState([]);
  const [zip, setZip] = useState([]);
  const userLogin = (event) => {
    event.preventDefault();
    console.log("login starting");
    fetch("https://frontend-take-home-service.fetch.com/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: enteredUsername,
        email: enteredEmail,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          setIsAuthentic(true);
        }
        return response.json();
      })
      .then((json) => {
        console.log(json[0]);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {
        getBreeds();
      });
  };

  // useEffect(() => {
  //   console.log(isAuthentic);
  // }, [isAuthentic]);

  const getBreeds = () => {
    fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setBreeds(json);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDogIds = () => {
    let query1;
    let query2;
    if (breed != []) {
      console.log(breed);
      query1 = `breeds=${breed}`;
    } else query1 = "";
    if (zip != []) {
      query2 = `&zipCodes=${zip}`;
    } else query2 = "";
    fetch(
      `https://frontend-take-home-service.fetch.com/dogs/search?${query1}`,
      {
        credentials: "include",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json.resultIds);

        dogIds = json.resultIds;
        getDogs();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDogs = () => {
    console.log(dogIds);
    fetch(`https://frontend-take-home-service.fetch.com/dogs`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
    })
      .then((response) => {
        let test = response.json();
        console.log(test);
        return test;
      })
      .then((json) => {
        console.log(json);
        setDogs(json);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          console.log(response.status, "logging out");
          setIsAuthentic(false);
        }
        response.json();
      })
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (event) => {
    setEnteredUsername(event.currentTarget.value);
  };

  const updateEmail = (event) => {
    setEnteredEmail(event.currentTarget.value);
  };

  const search = (e) => {
    e.preventDefault();
    getDogIds();
  };

  return (
    <div className="App">
      {!isAuthentic ? (
        <div>
          <form onSubmit={userLogin}>
            <input
              type="text"
              value={enteredUsername}
              onChange={updateUser}
              placeholder="Username"
            />
            <input
              type="email"
              value={enteredEmail}
              onChange={updateEmail}
              placeholder="Email"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div>
          {/* <button onClick={getBreeds}>breeds</button> */}
          <button onClick={logout}>Logout</button>

          <form action="">
            <div className="form-group">
              <label htmlFor="breeds">Breeds</label>
              <select
                name="breeds"
                id=""
                value={breed}
                onChange={(e) => {
                  setBreed(e.target.value);
                }}
              >
                <option value="" key="All">
                  All
                </option>
                {breeds.map((breed, idx) => {
                  return (
                    <option key={breed + idx} value={breed}>
                      {breed}
                    </option>
                  );
                })}
              </select>
              <label htmlFor="zip">ZipCode</label>
              <input
                id="zip"
                type="text"
                onChange={(e) => {
                  setZip(e.target.value);
                }}
              />
              <button onClick={search}>Search</button>
            </div>
          </form>
          <ul>
            {dogs.map((dog, id) => {
              return (
                <li class="dog-card" key={`${dog}${id}`}>
                  <img src={dog.img} alt="" />
                  <div>
                    <p>Name: {dog.name}</p>
                    <p>Age: {dog.age}</p>
                    <p>ZipCode: {dog.zip_code}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
