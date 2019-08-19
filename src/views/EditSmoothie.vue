<template>
  <div v-if="smuti" class="edit-smoothie container">
      <!-- <h2>Edit Smoothie: {{ this.$route.params.smoothie_slug }}</h2> -->
        <h2>Edit Smoothie: {{ smuti.title }} Smoothie</h2>

        <form @submit.prevent="editSmoothie">
            <div class="field title">
                <label for="title">Smoothie Title:</label>
                <input type="text" name="title" v-model="smuti.title">
            </div>

            <div v-for="(ingr, index) in smuti.ingredients" :key="index" class="field">
                <label for="ingredients">Ingredient:</label>
                <input type="text" v-model="smuti.ingredients[index]">
                <!-- ne mozemo samo za v-model ovde da stavimo ingr ovo iz loopa da outputujemo, jer to ingr ne postoji nigde van ovog v-for loopa, a mi zelimo da bajdnujemo u komponentu...ali ingredients niz postoji u data(), i u njega pozovemo index.
                I recimo da editujemo sad neki ingredient ovde, ono se updejtje i u nizu ingredients  -->
                <i class="material-icons delete" @click="deleteIngr(ingr)">delete </i>
            </div>

            <div class="field edit-ingredient">
                <label for="edit-ingredient">Edit Ingredient</label>
                <input type="text" name="edit-ingredient" @keydown.tab.prevent="addIngr" v-model="another"><!-- ovo prevent na keydown tab eventu je da bi izbegli difoltno ponasanje kada se pritisne tab a to je da ode na sledece polje/element il sta vec, nama treba da se okine ova f-ja -->
            </div>

            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{ feedback }}</p>
                <button class="btn pink">Update Smoothie</button>
            </div>
        </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'EditSmoothie',

    data() { 
        return {
            smuti: null,
            another: null,
            feedback: null
        }
    },

    methods: {
        editSmoothie() {
            // console.log(this.smuti.title, this.smuti.ingredients)
            if(this.smuti.title) {
                this.feedback = null

                // create a slug
                this.smuti.slug = slugify(this.smuti.title, {
                    replacement: '-',
                    remove: /[*+~.()'"!-:@]/g,
                    lower: true
                })
                // console.log(this.smuti.slug)

                // update podataka u firestore!
                db.collection('smoothies').doc(this.smuti.id).update({ // za update, pre update() metoda ide doc() kom prosledjujemo this.smuti.id, tj id smutija koji hocemo da apdejtujemo
                    title: this.smuti.title,
                    ingredients: this.smuti.ingredients,
                    slug: this.smuti.slug
                }).then(() => {
                    this.$router.push({ name: 'index' })
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'You must enter the title'
            }
        },

        addIngr() {
            if(this.another) {
                this.smuti.ingredients.push(this.another)
                this.another = null
                this.feedback = null
            } else {
                this.feedback = 'You must enter a value to add an ingredient'
            }
        },

        deleteIngr(ing) {
            this.smuti.ingredients = this.smuti.ingredients.filter(ingredient => ingredient != ing)
        }
    },

    created() { // zelimo da ovde dohvatimo podatke kada se component kreira ali ne i renderuje
        // prvo pravimo referencu dokumentu koji zelimo da sacuvamo u varijabli
        // let ref = db.collection('smoothies').doc(id) // ovako sa ovim doc(id) bismo inace dohvatali single doc i prosledjujemo mu id kog doca zelimo da dohvatimo, ali ovoga x nemamo id, imamo samo slug, tako da ne mozemo ovako sa doc(id), vec cemo sa where(), jer nam je jedino poznat slug, a slug se cuva u podacima doc-a, jedan je od propertyja zapravo. Tako da cemo da dohvatimo te podatke i koristeci where() metod dohvatimo slug koji je jednak prosledjenom slug-u:
        let ref = db.collection('smoothies').where('slug', '==', this.$route.params.smoothie_slug) // where() prihvata tri argumenta, prvi je property unutar doc-a koji zelimo da dohvatimo i poredimo sa necim, drugi arg je znak da li >, <, ==, itd, a treci arg je sa cim poredimo prvi argument, mi konkretno poredimo sa trenutim smoothie_slug-om iz url-a
        ref.get().then((snapshot) => { // zatim to sto smo sacuvali u ref, za get() metodom dohvatanim a potom, posto je on asinhron i vraca Promice, dalje sa then() te podatke koje smo dohvatili pozivamo kao snapshop, i potom lupujemo kroz sve podatke u tom snapshotu
            snapshot.forEach(doc => {
                // console.log(doc.data())
                // koji god da je slug gore, dohvatamo ga, vrsimo upit sa bazom uvezi tog sluga, dohvatamo podatke iz baze za smuti gde se poklapa taj slug, pushujemo tu vrednost u smuti property, i potom mu dodajemo id doca
                this.smuti = doc.data()
                this.smuti.id = doc.id // dodajemo id za smuti, i to ce biti id doc-a. I sada mozemo da outputujemo ovo u template kao smuti.title.
                // medjutim, sada nam se javlja error u konzoli:  Cannot read property 'title' of null.... To je jer ne moze da procita smuti.title property kada je PRVI X ucitano u DOM, i onda ovaj deo sa ref.get()...... mozda jos nije odradjeno, treba mu malo vremena. Tako da cemo da dodamo gore v-if za smuti. dakle ako je smuti null, onda ce taj v-if da bude false, i onda se nece prikazati taj div gde se nalazi h2 tag i to.
                // a kada se taj smuti apdejtuje, tj kada se odradi ovaj kod this.smuti = doc.data() i ovaj za id, onda se apdejtuje smuti property i ono vise nije null vec ima neku konkretniju vrednost i onda taj v-if bude true i prikaze se onaj gore div
                // i sada imamo pristup smutiju unutar componente i sada mozemo da mu pristupimo i editujemo podatke smutija
            })
        })
    }
}
</script>

<style lang="scss">
.edit-smoothie {
    h2 {
        font-size: 2em;
        margin: 20px auto;
    }

    .field {
        margin: 20px auto;
        position: relative;
    }

    .delete {
        position: absolute;
        right: 0;
        bottom: 16px;
        font-size: 1.4em;
        color: #aaa;
        cursor: pointer;
    }
}
</style>