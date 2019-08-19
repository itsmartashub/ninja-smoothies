<template>
  <div class="index container">
      <div class="card" v-for="smoothie in smoothies" :key="smoothie.id">
        <div class="card-content">
          <i class="material-icons delete" @click="deleteSmoothie(smoothie.id)">delete</i>
            <h2 class="indigo-text">{{ smoothie.title }}</h2>
            <ul class="ingredients">
              <li v-for="(ing, index) in smoothie.ingredients" :key="index">
                <span class="chip">{{ ing }}</span>
              </li>
            </ul>
        </div>

        <span class="btn-floating btn-large halfway-fab pink">
          <router-link :to="{ name: 'edit smoothie', params: { smoothie_slug: smoothie.slug }}">
            <!-- za params stavljamo da je smoothie_slug (to je u routeru onaj deo u putanji :smoothie_slug) jednak smoothie.slug. Ovo ovde smoothie je iz ovog gore v-fora, pa preko njega dohvatamo slug -->
              <i class="material-icons edit">edit</i>
            </router-link>
        </span>
      </div>
  </div>
</template>

<script>
import db from '@/firebase/init' // ovo db mozemo da anzovemo kako god, ugl importujemo onaj deo koji smo exportovali u fajli init.js (firebaseApp.firestore()) sto je u sustini nasa baza koju napravismo na firebase u firestore
// elem, sada treba da skontamo u kom delu lifecycle componente ovo treba da koristimo, kada to mi zelimo da interagujemo sa bazom. Ninja kaze da je najbolje u created() lifecycle jer je komponenta tad kreirana, ali nije jos renderovana u DOM

export default {
  name: 'Index',
  data() {
    return {
      // smoothies: [ // ovo je dok nismo imali db
      //   { title: 'Ninja Brew', slug: 'ninja-brew', ingredients: ['bananas', 'coffee', 'milk'], id: 1 },
      //   { title: 'Morning Mood', slug: 'morning-mood', ingredients: ['mango', 'lime', 'juice'], id: 2 }
      // ]
      smoothies: []
    }
  },

  methods: {
    deleteSmoothie(smutiID) {
      // delete doc from firestore
      db.collection('smoothies').doc(smutiID).delete() // doc() je firestore metod i referencira nam document, saljemo mu id na koji zelimo da se odnosi, tj na koju document sa kojim id-em da upucuje, potom takodje firestore delete() metodom brisemo u firestore...ali da bismo obrisali i na frontendu, treba ponovo da filterisemo kroz smoothies niz
      .then(() => { // ne stavljamo nistaa u then-ovu callback za argument jer brisemo, nema sta da saljemo iz baze na frontend
        this.smoothies = this.smoothies.filter(smoothie => smoothie.id != smutiID)
      })


      // this.smoothies = this.smoothies.filter(smoothie => smoothie.id != smutiID)
    }
  },

  created() {
    // fetch data from the firestore
    db.collection('smoothies').get() // smoothies je ime documenta koji dadosmo u firestore
    .then(snapshot => {
      // console.log(snapshot); // dobijamo neki firebase shit u sustini niz sa podacima
      snapshot.forEach(doc => {
        // console.log(doc); // i s ovim dobijamo document sa mnoostvo nekim podacima, ali i dalje ne kakav bi nam trebao, treba da pozovemo data() metod
        // console.log(doc.data(), doc.id); // { ingredients: Array(3), slug: "ninja-brew", title: "Ninja Brew" }, {ingredients: Array(3), slug: "morning-mood", title: "Morning Mood" }
        // a id doc-a se nalazi u doc-u, doc objektu, a ne u podacima doc-a
        let smoothie = doc.data()
        smoothie.id = doc.id
        this.smoothies.push(smoothie)
      })
    })
     
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.index {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
  place-content: center;
  grid-gap: 50px;
  margin-top: 60px;
  text-align: center;
}

.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}

.index .ingredients {
  margin: 30px auto;
}

.index .ingredients li {
  display: inline-block;
}

.index .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}
</style>
