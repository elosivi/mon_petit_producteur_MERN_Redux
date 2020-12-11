# `WORK IN TEAM WITH GIT `

<br><br>
# **BEFORE TO CODE ...**
<br>

## **LES BRANCHES :** before code :

```$ git branch nom_branche```<br>
```$ git checkout  nom_branche```<br>
ou : ```$ git checkout -b nom_branche```<br>
```$ git branch  #[nom_branche]``` (commande de test, doit renvoyer le nom de la branche sur laquelle on est)<br>


<br><br>
### **BRANCHE COMMUNE:**
<br>

1. **1 dev:** push
dev crée la branche + push <br>
```$ git checkout -b nom_branche```<br>
```$ git add …``` / ```$ git commit …``` / ```$ git push origin nom_branche```<br>


2. **le 2nd dev:** pull
```$ git pull origin nom_branche```<br>
```$ git checkout nom_branche```<br>


<br><br>
# **GO TO DEV...! THEN...** 
<br>


## **LES PUSH**
```$ git status```<br>  
ou ```$ git status -u```<br>
```$ git add [fichiersName]``` <br>
ou  ```$ git add -u``` (Cela permet d'ajouter au staging seulement les fichiers déjà suivis et ne touche en aucun cas aux fichiers non suivi)<br>
```$ git commit -m “[devName] fonctionnalité+com”```<br>
```$ git push origin  [newbranchename]```: pousser ses fichiers ou sa version locale sur la branche [newbranchename] <br>



## **LES PULL**
```$ git pull origin [newbranchename]``` : récupérer la version sur [newbranchename] - Attention écrase sa version avec celle du server Git<br>
```$ git pull```  : avoir les nouvelles branches<br>



## **SUIVI**
```$ git log --graph --oneline --color``` (ou configurer git olga dans le fichier <br>




<br><br>
# **DEV OK... NOW..**.
<br>


## **MERGE avec branche Dev :** 
```$ git merge nombranche dev``` : dev: branche de dev commune à tous les dev<br>



## **SUPPRIMER la branche :** 
```$ git branch -d localBranchName ou -D```<br>
```$ git push origin --delete remoteBranchName```<br>
```$ git fetch -p```<br>



## **SUPPRIMER un fichier en local + du server:**
```$ git rm nom_fichier```<br>
```$ git commit -m “[delete]nom_fichier”```<br>
```$ git push origin localBranchName```<br>
