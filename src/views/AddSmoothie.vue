<template>
    <div class="add-smoothie container">
        <h2 class="center-align indigo-text">Add New Smoothie Recipe</h2>
        <form @submit.prevent="addSmoothie">
            <div class="field title">
                <label for="title">Smoothie Title:</label>
                <input type="text" name="title" v-model="title">
            </div>

            <div v-for="(ingr, index) in ingredients" :key="index" class="field">
                <label for="ingredients">Ingredient:</label>
                <input type="text" v-model="ingredients[index]">
                <!-- ne mozemo samo za v-model ovde da stavimo ingr ovo iz loopa da outputujemo, jer to ingr ne postoji nigde van ovog v-for loopa, a mi zelimo da bajdnujemo u komponentu...ali ingredients niz postoji u data(), i u njega pozovemo index.
                I recimo da editujemo sad neki ingredient ovde, ono se updejtje i u nizu ingredients  -->
                <i class="material-icons delete" @click="deleteIngr(ingr)">delete </i>
            </div>

            <div class="field add-ingredient">
                <label for="add-ingredient">Add Ingredient</label>
                <input type="text" name="add-ingredient" @keydown.tab.prevent="addIngr" v-model="another"><!-- ovo prevent na keydown tab eventu je da bi izbegli difoltno ponasanje kada se pritisne tab a to je da ode na sledece polje/element il sta vec, nama treba da se okine ova f-ja -->
            </div>

            <div class="field center-align">
                <p v-if="feedback" class="red-text">{{ feedback }}</p>
                <button class="btn pink">Add Smoothie</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    name: 'AddSmoothie',
    data() {
        return {
            title: null, // to je ovaj title u v-model, za difoltni smo ga stavili da bude null, ali cim korisnik krene nesto da kucka u tom inputu, vrednost title ce biti upravo onoga sto je korisnik uneo. Inace, za add-ingredients nismo stavili v-model, nisam bas razumela zasto, nesto kao mi zelimo da korisnik ukuca samo jedan sastojak, ali on moze i 4 recimo...ugl kasnije cemo to resiti sa tab eventom
            another: null,
            ingredients: [],
            feedback: null,
            slug: null
        }
    },

    methods: {
        addSmoothie() {
            // console.log(this.title, this.ingredients);
            if(this.title) {
                this.feedback = null

                // create a slug
                this.slug = slugify(this.title, {
                    replacement: '-', // da razmake koje bimogli biti u naslovu zameni za crticom -
                    remove: /[*+~.()'"!-:@]/g, // da specijalni karaketrei koje bi korisnik mozda uneo za naslov budu uklonjeni kada se bude formirao slug (to je kao deo adrese u url-u, poslednji deo putanje, kao gde smo trenutno)
                    lower: true // da sva slova budu mala
                })
                console.log(this.slug)

                // upis podataka u firestore!
                db.collection('smoothies').add({
                    title: this.title,
                    ingredients: this.ingredients,
                    slug: this.slug
                }).then(() => { // ovo add() je asinhroni proces, vvraca promice i zato mozemo pozvati then(), i dakle nekon sto dodamo podatke u BAZU, redirectujemo korisnika na rutu cije je ime index, tj na index stranicu, index prikaz/component
                    this.$router.push({ name: 'index' })
                }).catch( err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'You must enter the title'
            }
        },

        addIngr() {
            if(this.another) { // ako je ovo true znaci da another nije vise null tj da polje add ingredient nije prazno
                this.ingredients.push(this.another)
                console.log(this.ingredients)
                this.another = null
                this.feedback = null
            } else {
                this.feedback = 'You must enter a value to add an ingredient'
            }
        },

        deleteIngr(ingr){
            this.ingredients = this.ingredients.filter(ingredient => ingredient != ingr)
        }
    }
}
</script>

<style lang="scss">
.add-smoothie {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;

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