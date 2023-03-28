const api_url = "http://localhost:3000/api/products/";
//Récupération du local storage 
let cartStockage = localStorage;
let cart = JSON.parse(cartStockage.getItem("cart"));
//---------------------------------------------------//
//Variables des totaux 
let quantityTotal = 0;
let priceTotal = 0;
//---------------------------------------------------//
//Recupération des elemements DOMs
let totalQuantity = document.getElementById("totalQuantity");
let totalprice = document.getElementById("totalPrice");
let formOrder = document.querySelector("form.cart__order__form");
let formNom = document.getElementById("firstName");
let formPrenom = document.getElementById("lastName");
let formMail = document.getElementById("email");
let formAdresse = document.getElementById("address");
let formVille = document.getElementById("city");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");
let buttonOrder = document.getElementById("order");
//---------------------------------------------------//
let objetCart = {}
/*Récuperation des produits dans le panier 
*@param {String} id
*@return {promise}
*/
async function getCart(id) {
  return fetch(api_url + id)
    .then(res => { if (res.ok) { return res.json() } else { return res.status; } })
    .catch(err => { console.log(err) });
}
/*Affichage du panier 
*@param {object} listItemCart
*@param {object} itemAPI
*/
function displayCart(listItemCart, itemAPI) {
  let cart__items = document.getElementById("cart__items");
  //Affichage de l"element article 
  let article = document.createElement("article");
  article.setAttribute("data-id", listItemCart.ref);
  article.setAttribute("data-color", listItemCart.color);
  article.classList.add("cart__item");
  //Affichage de l"image 
  let imgDiv = document.createElement("div");
  imgDiv.classList.add("cart__item__img");
  let image = document.createElement("img");
  image.setAttribute("src", itemAPI.imageUrl);
  image.setAttribute("alt", itemAPI.altTxt);
  //Affichage des élements de description 
  let contentDiv = document.createElement("div");
  contentDiv.classList.add("cart__item__content");
  let descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("cart__item__content__description");
  let name = document.createElement("h3");
  name.textContent = itemAPI.name;
  let color = document.createElement("p");
  color.textContent = listItemCart.color;
  let price = document.createElement("p");
  price.textContent = itemAPI.price;
  let settingsDiv = document.createElement("div");
  settingsDiv.classList.add("cart__item__content__settings");
  let quantityDiv = document.createElement("div");
  quantityDiv.classList.add("cart__item__content__settings__quantity");
  let quantity = document.createElement("p");
  quantity.textContent = "Qté : " + listItemCart.qty;
  //Affichage du champs des quantitées 
  let inputQty = document.createElement("input");
  inputQty.setAttribute("type", "number");
  inputQty.setAttribute("name", "itemQuantity");
  inputQty.setAttribute("min", "1");
  inputQty.setAttribute("max", "100");
  inputQty.setAttribute("value", listItemCart.qty);
  inputQty.classList.add("itemQuantity");

  inputQty.addEventListener("change", (e) => { modifQuantity(listItemCart.ref, listItemCart.color, itemAPI.price, e.target) });
  //Affichage des élement de suppression des produit du panier   
  let deleteDiv = document.createElement("div");
  deleteDiv.classList.add("cart__item__content__settings__delete");
  let deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");
  deleteItem.textContent = "Supprimer"
  deleteItem.addEventListener("click", (e) => { delItem(listItemCart.ref, listItemCart.color, itemAPI.price, article) });
  //Calcule des totaux pour chaque produits affiché 
  priceTotal += +itemAPI.price * +listItemCart.qty;
  quantityTotal += +listItemCart.qty;
  //Construction du DOM
  deleteDiv.append(deleteItem);
  quantityDiv.append(quantity, inputQty);
  settingsDiv.append(quantityDiv, deleteDiv);
  descriptionDiv.append(name, color, price);
  contentDiv.append(descriptionDiv, settingsDiv);
  imgDiv.append(image);
  article.append(imgDiv, contentDiv);
  cart__items.append(article);
}
/* Retrouve un item dans le panier avec son id et sa couleur
*@param {String} ref 
*@param {String} color
*@return {number} productFound
*/
function productFounder(ref, color) {
  return productFound = cart.findIndex(p => p.ref == ref && p.color == color);
}
//vider le panier après la suppression de tout les items 
function emptyCart() {
  buttonOrder.setAttribute('disabled', '');
  buttonOrder.style.background = "grey"
  buttonOrder.style.color = "#333"
  cart__items.textContent = "Votre panier est vide"
}
//Modificaiton du panier
function setCart() {
  cartStockage.setItem("cart", JSON.stringify(cart));
  if (cart.length == 0) {
    cartStockage.removeItem("cart");
    emptyCart()
  }
}
/*Modification des quantitées d"un produit du panier 
*@param {String} id 
*@param {String} color 
*@param { number } price
*@param { HTMLElement } input  
*/
function modifQuantity(id, color, price, input) {
  let labelQuantity = input.previousElementSibling;
  let indexCart = productFounder(id, color)
  labelQuantity.style.backgroundColor = "";
  if (input.value != 0 && input.value > 0 && input.value <= 100) {
    labelQuantity.textContent = "Qté : " + input.value;
    updateTotaux(indexCart, input, price, false);
    cart[indexCart].qty = +input.value;
    setCart();
  } else {
    displayErrorModif(labelQuantity)
  }
}
/* Affichage des erreurs de la modification du panier 
*@param {HTMLElement} labelQuantity
*/
function displayErrorModif(labelQuantity) { 
  labelQuantity.style.backgroundColor = "red";
}
/*suppression d"un élement du panier 
*@param {String} id
*@param {String} color
*@param { number } price
*@param { HTMLElement } article
*/
function delItem(id, color, price, article) {
  let indexCart = productFounder(id, color)
  updateTotaux(indexCart, article, price, true);
  article.remove();
  cart.splice(indexCart, 1);
  setCart();
  cartPastille(true);
}
/*Metre a jour les tataux lors du changement des quantitées ou de leurs suppression 
*@param {number} id
*@param { HTMLElement } elm
*@param { number } price
*@param {boolean} remouve
*/
function updateTotaux(id, elm, price, remouve) {
  //mise a jour lors de la suppression 
  if (remouve == true) {
    quantityTotal -= +cart[id].qty;
    priceTotal -= +cart[id].qty * +price;
  } else {
    //Mise a jour lors de la modification des quantitées        
    quantityTotal -= +cart[id].qty;
    quantityTotal += +elm.value;
    priceTotal -= +cart[id].qty * +price;
    priceTotal += +elm.value * +price;
  }
  displayTotal();
}

//Affichage des tataux 
function displayTotal() {
  totalQuantity.textContent = quantityTotal;
  totalprice.textContent = priceTotal;
}
/*Regex de vérification des chanps de confirmation 
*@param { String }  valueInput 
*@param { String }  type
*@return { Boolean }  
*/
function regexVerif(valueInput, type) {
  let regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let regexString = /[a-zA-Z]/;
  let regexNumber = /[0-9]/;
  switch (type) {
    case "string":
      return regexString.test(valueInput);
      break;
    case "number":
      return regexNumber.test(valueInput);
      break;
    case "email":
      return regexMail.test(valueInput);
  }
}
/*Afficher les erreurs du formulaire 
*@param { HTMLElement  } elementMessageError
*@param { HTMLElement  } elementForm
*@param { String } formError
*@return { boolean } true
*/
function displayError(elementMessageError, elementForm, formError) {
  elementForm.style.background = "red";
  elementMessageError.textContent = `le champs ${formError} est mal renseigné`;
  return true;
}
/*Verificaiton du formulaire de commande
*@return { boolean } error
*/
function verifForm() {
  let error = false;
  if (regexVerif(formNom.value, "string") == false || formNom == "") {
    error = displayError(firstNameErrorMsg, formNom, "Prénom");
  }
  if (regexVerif(formPrenom.value, "string") == false || formPrenom == "") {
    error = displayError(lastNameErrorMsg, formPrenom, "Nom");
  }
  if (regexVerif(formMail.value, "email") == false || formMail == "") {
    error = displayError(emailErrorMsg, formMail, "Email");
  }
  if (formAdresse.value == "") {
    error = displayError(addressErrorMsg, formAdresse, "Adresse");
  }
  if (regexVerif(formVille.value, "number") != false || formVille == "") {
    error = displayError(cityErrorMsg, formVille, "Ville");
  }
  return error
}
//Création de l'objet de confirmation du panier 
function objetConfirmationCart() {
  return objetCart = {
    contact: {
      firstName: formNom.value,
      lastName: formPrenom.value,
      address: formAdresse.value,
      city: formVille.value,
      email: formMail.value
    },
    products: cart.map(product => product.ref)
  }
}
/*Envoi la commande a l'API 
*@return {promise}
*/
async function sendOrder() {
  objetConfirmationCart() 
  return fetch(api_url + "order", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      objetCart
    )
  })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) });
}
//Fonction de commande 
async function order() {
  if (!verifForm()) {
    let result = await sendOrder();
    localStorage.removeItem("cart");
    window.location.assign("./confirmation.html?idOrder=" + result.orderId);
  }
}
/*Affichage de la pastille du panier
*@param { boolean } modif
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

  if (cart != null && cart.length != 0 && !modif) {
    cartPastille.textContent = cart.length;
    cartMenu.append(cartPastille);
  } else if ((cart != null && cart.length != 0) && modif) {
    cartPastille = document.getElementById("cartPastille");
    cartPastille.textContent = cart.length;
  } else if (cart.length == 0 && modif) {
    cartPastille = document.getElementById("cartPastille");
    cartPastille.remove();
  }
}
/*trie des items dans le panier
*@param { object } items
*
*/
function sortItemCart(items) {
  items.sort(function (x, y) {
    let a = x.ref.toUpperCase(),
      b = y.ref.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });
  return items
}
//Fonction principal 
async function main() {
  let serveur = "";
  if (cart != null && cart.length != 0) {
    let sortCart = sortItemCart(cart)
    for (listItemCart of sortCart) {
      let itemAPI = await getCart(listItemCart.ref);
      if (itemAPI != undefined && itemAPI != "404") {
        displayCart(listItemCart, itemAPI);
        displayTotal();
        formOrder.addEventListener("submit", (e) => {
          e.preventDefault();
          order();
        });
      } else {
        serveur = "off";
      }
    }
    if (serveur == "off") { cart__items.textContent = "Erreur du serveur revenez plus tard" }
    cartPastille(false);
  } else {
    emptyCart();
  }
}
main();