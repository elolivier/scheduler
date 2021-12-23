import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAm4Ip6jI02ef2mmLa6hMw3PUDdSlSt1yc",
  authDomain: "scheduler-35538.firebaseapp.com",
  databaseURL:
    "https://scheduler-35538-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "scheduler-35538",
  storageBucket: "scheduler-35538.appspot.com",
  messagingSenderId: "870991158416",
  appId: "1:870991158416:web:518d77060e90c8b1f90c15",
  measurementId: "G-XKR2NGS9W4",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const setData = (path, value) => (
    set(ref(database, path), value)
  );

export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode =
      !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    if (devMode) {
      console.log(`loading ${path}`);
    }
    return onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        if (devMode) {
          console.log(val);
        }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      }
    );
  }, [path, transform]);

  return [data, loading, error];
};
