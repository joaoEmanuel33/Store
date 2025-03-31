function openModal(prodctId, prodctName, prodctPrice, prodctImage ){
    document.getElementById("modal-prodct-image").src = prodctImage;
    document.getElementById("modal-prodct-name").textContent = prodctName;
    document.getElementById("modal-prodct-price").textContent = "R$" + prodctPrice;
    document.getElementById("quantidade-modal").style.display = "block";
}