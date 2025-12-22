//création de la fonction
// son rôle gérer le formulaire de connexion (écouter l’envoi + envoyer les infos à l’API)
function ajoutlistenerForm () {
    const FormLogin = document.querySelector(".FormLogin");

    FormLogin.addEventListener("submit", function(event){
        event.preventDefault(); // empêche le rechargement de la page

        // Récupération des valeurs du formulaire, on récupére ce que l'utilisateur a tapé
        // Création d'un objeT JS avec l’email et le MP
        const Form = {
            email: document.querySelector("#email").value,
            password: document.querySelector("#pass").value,
        };

        //transforme l'objet en texte JSON
        const formatJSON = JSON.stringify(Form);

        // Requête POST vers l’API de login
        fetch("http://localhost:5678/api/users/login", {
            //methode : le type de requête (GET, POST…)
            method: "POST",// method : "POST" envoyer des données au serveur
            //headers : précise que l’on envoie du JSON
            headers: { "Content-Type": "application/json" },
            //body : contient l’email + mot de passe
            body: formatJSON
        })
        
        .then(response => {
            // Si les identifiants sont incorrects
            if (!response.ok) {
                throw new Error("Email ou mot de passe incorrect");
            }
            // Sinon on transforme la réponse en JSON
            return response.json();
        })
        .then(data => {
            // Stockage du token dans le localStorage
            localStorage.setItem("token", data.token);

            // Redirection vers la page d’accueil
            window.location.href = "index.html";
        })
        .catch(error => {
            // Affichage d’un message d’erreur à l’utilisateur
            alert(error.message);
        });
    });
}

// IMPORTANT : appel de la fonction
ajoutlistenerForm();