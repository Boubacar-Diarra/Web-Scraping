
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        try {
            let data = {
            
                "prenom_nom": "",
                "status": "",
                "info": "",
                "formation": "",
                "experience": "",
                "licences_certification": "",
                "competences": ""
            }
            //on initialise le parser
            let parser = new DOMParser();

            //on recupere le nom et le prénom de la personne
            let xmlParser = parser.parseFromString(document.getElementById("ember54").innerHTML, "text/html");
            if (xmlParser.getElementsByClassName("inline")[0] !== null && xmlParser.getElementsByClassName("inline")[0] !== undefined) {
                let prenom_nom = xmlParser.getElementsByClassName("inline")[0].innerText
                //prenom_nom = prenom_nom.split('\n').join();
                data.prenom_nom = prenom_nom;
            }
            if (xmlParser.getElementsByTagName("h2")[0] !== null && xmlParser.getElementsByTagName("h2")[0] !== undefined) {
                let status = xmlParser.getElementsByTagName("h2")[0].innerText;
                status = status.split('\n').join()
                data.status = status;
            }

            let info_regex = /.*[I-i]nfos.*/;
            let formation_regex = /.*[F-f]ormation.*/;
            let competences_regex = /.*[C-c]ompétences.*/;
            let experience_regex = /.*[E-e]xpérience.*/;
            let h2 = '';
            let h3 = '';
            let xmlParser2;
            xmlParser = parser.parseFromString(document.getElementsByClassName("profile-detail")[0].innerHTML, "text/html");
            let divs = xmlParser.getElementsByTagName("div");

            for (let i = 0; i < divs.length; i++) {

                xmlParser2 = parser.parseFromString(divs[i].innerHTML, "text/html");
                h2 = xmlParser2.getElementsByTagName('h2')[0];


                //on recupere les informations qui sont dans la de la section "infos"
                if(h2 !== null && h2 !== undefined && info_regex.test(h2.innerText))
                {
                    let spans = xmlParser2.getElementsByTagName('span');
                    let infos = "";
                    for(let j = 0; j < spans.length; j++){
                        infos += spans[j].innerText;
                    }
                    if(infos !== "") {
                        info_regex = /none/
                    }
                    infos = infos.split('\n').join();
                    data.info = infos;
                }

                //on recupere les informations de la section  "competences"
                if(h2 !== null && h2 !== undefined && competences_regex.test(h2.innerText))
                {
                    let spans = xmlParser2.getElementsByTagName('span');
                    let competences = "";
                    for(let j = 0; j < spans.length; j++){
                        competences += spans[j].innerText;
                    }
                    if(competences !== "")
                        competences_regex = /none/;
                    competences = competences.split('\n').join();
                    data.competences = competences;
                }

            }

            let experience = document.getElementById('experience-section');

            if(experience !== null && experience !== undefined) {
                data.experience = experience.innerText;
            }
            let formation = xmlParser.getElementById('education-section');
            if(formation !== null && formation !== undefined) {
                data.formation = formation.innerText;
            }
            let licence = xmlParser.getElementById('certifications-section');
            if(licence !== null && licence !== undefined) {
                data.licences_certification = licence.innerText;
            }

            if (request.order === "extraire") {

                sendResponse({farewell: JSON.stringify(data)});
            }
        } catch (e) {
            alert("Une erreur c'est produite, veuillez recharger la page")
            sendResponse({farewell: "Erreur"});
        }
    });