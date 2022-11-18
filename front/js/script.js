const api_url = "http://localhost:3000/api/products/";
let items = document.getElementById("items");
//Récupération du local storage 
let cartStockage = localStorage;
let cart = JSON.parse(cartStockage.getItem("cart"));
//---------------------------------------------------//
/*Récuperation des produits 
*@return {promise}  
*/
async function getListeOfProducts() {
    return fetch(api_url)
        .then(res => { return res.json() })
        .catch(err => { console.log(err) });
}
/*Affichage de la pastille du panier
*@param { boolean } modif
*
*/
function cartPastille(modif) {
    let cartPastille = document.createElement('span');
    cartPastille.style.background = "red";
    cartPastille.style.color = "white";
    cartPastille.style.position = "relative";
    cartPastille.style.height = "20px";
    cartPastille.style.lineHeight = "20px";
    cartPastille.style.padding = "0 6px";
    cartPastille.style.borderRadius = "12px";
    cartPastille.style.left = "-5px";
    cartPastille.style.top = "10px";
    cartPastille.setAttribute("id", "cartPastille");
    let cartMenu = document.querySelector("nav ul a:nth-child(2)");
    if (cart != null && cart.length != 0 && !modif) {
        cartPastille.textContent = cart.length;
        cartMenu.append(cartPastille);
    } else if (cart != null && modif) {
        cartPastille = document.getElementById("cartPastille");
        cartPastille.textContent = cart.length;
    }
}
/*Affichage des produits 
*@param {object} item
*/
function diplayProduct(item) {
    let article = document.createElement("article");
    let image = document.createElement("img");
    image.setAttribute("src", item.imageUrl);
    image.setAttribute("alt", item.altTxt);
    let titre = document.createElement("h3");
    titre.textContent = item.name;
    titre.classList.add("productName");
    let description = document.createElement("p");
    description.textContent = item.description;
    description.classList.add("productDescription");
    let link = document.createElement("a");
    link.setAttribute("href", "./product.html?id=" + item._id);
    article.append(image, titre, description);
    link.append(article);
    items.append(link);
}
//Fonction principal 
async function main() {
    let listProducts = await getListeOfProducts();
    if (listProducts != undefined) {
        for (let item of listProducts) {
            diplayProduct(item);
        }
        cartPastille(false)
    } else {
        items.textContent = "Erreur du serveur revenez plus tard"
    }
}
main();