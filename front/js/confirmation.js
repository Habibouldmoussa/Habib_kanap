const url = new URL(window.location.href);
const id = url.searchParams.get("idOrder");
//Affichage du numéro de commande sinon redirection vers la page d'acceuil
function main() {
    let orderId = document.getElementById("orderId");
    if (id != null) {
    orderId.textContent = id;
    } else {
        window.location.assign("./index.html")
    }

}
main();