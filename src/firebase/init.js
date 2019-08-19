import * as firebase from "firebase/app"
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB-OIzewEkdun_VjMiQyFIG-GJrxooU4bg",
    authDomain: "unique-ninja-smoothies.firebaseapp.com",
    databaseURL: "https://unique-ninja-smoothies.firebaseio.com",
    projectId: "unique-ninja-smoothies",
    storageBucket: "unique-ninja-smoothies.appspot.com",
    messagingSenderId: "621735500018",
    appId: "1:621735500018:web:d133d85a2b8567b2"
  };
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
// firebaseApp.firestore().settings({ timestampsInSnapshots: true })

// export firestore database
export default firebaseApp.firestore() // zelimo da exportujemo bazu, deo ovog firebaseApp

