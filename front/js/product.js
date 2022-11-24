const api_url = "http://localhost:3000/api/products/";
//Recuperation de l'id du produit dans l'url de la page 
const url = new URL(window.location.href);
const id = url.searchParams.get("id");
//---------------------------------------------------//
//Recupération des elemements DOMs
let imgItem = document.querySelector(".item__img");
let title = document.getElementById("title");
let price = document.getElementById("price");
let description = document.getElementById("description");
let colors = document.getElementById("colors");
let addToCart = document.getElementById("addToCart");
let quantity = document.getElementById("quantity");
//---------------------------------------------------//
//Récupération du local storage 
let cartStockage = localStorage;
let cart = JSON.parse(cartStockage.getItem("cart"));
//---------------------------------------------------//
/*Récuperer le produit de l'API 
*@return {promise}
*/
async function getProduct() {
    return fetch(api_url + id)
        .then(res => { if (res.ok) { return res.json() } else { return res.status; } })
        .catch(err => { console.log(err) });
}
/*Affichage des détails du produit  
*@param {object} value 
*/
function diplayProduct(value) {
    document.title = value.name;
    imgItem.innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}""> `;
    title.textContent = value.name;
    price.textContent = value.price;
    description.textContent = value.description;
    for (let color of value.colors) {
        let option = document.createElement("option");
        colors.appendChild(option);
        option.setAttribute("value", color);
        option.textContent = color;
    }
}
/*Affichage de la pastille du panier
*@param { boolean } modif
*
*/
function cartPastille(modif) {
    let cartPastille = document.createElement('span');
    cartPastille.style.background = "red";
    cartPastille.style.color = "white";
    cartPastille.style.margin = "0 5px";
    cartPastille.style.height = "20px";
    cartPastille.style.lineHeight = "20px";
    cartPastille.style.padding = "0 6px";
    cartPastille.style.borderRadius = "12px";
    cartPastille.setAttribute("id", "cartPastille");
    let cartMenu = document.querySelector("nav ul a:nth-child(2)");
    if (cart != null && !modif) {
        cartPastille.textContent = cart.length;
        cartMenu.append(cartPastille);
    } else if (cart != null && modif) {
        cartPastille = document.getElementById("cartPastille");
        cartPastille.textContent = cart.length;
    }
}
/*Recherche du produit en cas d'ajout du même produit de la même couleur  
*@return {number}  productFound
*/
function productFounder() {
    return productFound = cart.findIndex(p => p.ref == id && p.color == colors.value);
}
/*Affiche les commentaires lors des ajouts dans le panier
*@param {String} error
*/
function displayAlert(error) {
    let alerte = document.getElementById("alert_addcart")
    if (!!alerte) {
        alerte.remove();
    } 
    let alert = document.createElement('div');
    alert.style.color = "pink";
    alert.style.padding = "10px";
    alert.setAttribute("id", "alert_addcart")
    alert.textContent = error;
    addToCart.closest(".item__content").append(alert);    
}
//Ajout du produit au panier 
function addCart() {

    //Si tout les champs ne sont rempli corrproductFounderectement on ajoute pas le produit au panier 
    if (colors.value != "" && quantity.value > 0) {
        //Si le panier est vide on ajoute l'element en tant que tableau pour faire fonctionner la fonciton find 
        if (cart == null) {
            let cartItem = objectCart();
            cart = [cartItem];
            cartPastille(false);
            displayAlert("")
        } else {
            //Si le panier n'est pas vide on modifie seulement les quantitées 
            let itemInCart = productFounder();
            if (itemInCart != -1) {
                cart[itemInCart].qty = +cart[itemInCart].qty + parseInt(quantity.value);
                displayAlert("Attention le produit ajouté existe déjà par conséquant sa quantité augmentera")

            } else {
                //si le produit n'existe pas dans le panier on le push autant que objet 
                let cartItem = objectCart();
                cart.push(cartItem);
                cartPastille(true)
                displayAlert("")
            }
        }
        changeButtonAddCart("Produit ajouté", "green");
        setTimeout(changeButtonAddCart, 5000, "Ajouter au panier", "white");
        cartStockage.setItem("cart", JSON.stringify(cart));
    } else {
        displayError();
    }
}
/*Changement de l'aspect du bouton d'ajout au panier
*@param {String} text 
*@param {String} color
*/
function changeButtonAddCart(text, color) {
    addToCart.textContent = text;
    addToCart.style.color = color;
}
// Affichage des erreurs des ajouts au panier 
function displayError() {
    let blocSettingProduct = document.querySelector(".item__content__settings");
    blocSettingProduct.style.backgroundColor = "red";
}
/* Création de l'objet du panier 
*@return {object} cartItem
*/
function objectCart() {
    return cartItem = {
        ref: id,
        color: colors.value,
        qty: parseInt(quantity.value)
    };
}
// Fonction principal 
async function main() {
    let product = await getProduct();
    if (product != undefined && product != "404") {
        diplayProduct(product);
        addToCart.addEventListener("click", function (e) {
            e.preventDefault();
            addCart();
        })
        cartPastille(false)
    } else {
        title.textContent = "Produit inéxistant ou erreur du serveur revenez plus tard";
    }

}
main();