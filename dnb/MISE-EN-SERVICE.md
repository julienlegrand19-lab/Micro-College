# Astréon V1.15 — mise en service pilote

## Périmètre
Le site GitHub Pages fonctionne en entraînement local. Le Worker DNB candidat n'est pas le Worker de production. Ne pas activer les comptes réels avant validation par l'établissement/DPD et essais sur appareils physiques.

## Déploiement prudent
1. Sauvegarder la base Cloudflare D1 et la version actuelle du Worker (configuration et code, sans publier de secrets).
2. Sur une base de test, appliquer le schéma historique si nécessaire, puis school/migration-dnb.sql, puis school/migration-dnb-revision.sql une seule fois après contrôle de PRAGMA table_info(dnb_attempts). La deuxième migration ajoute une colonne de révision, sans supprimer les tentatives.
3. Déployer school/worker-dnb-candidate.js sur un environnement de test, lié à cette base. Conserver les secrets AUTH_PEPPER et ADMIN_SECRET hors du dépôt. Ne pas partager les mots de passe dans le code ou les captures.
4. Vérifier /health : dnb=1, dnbRevision=1, configured=true. Vérifier les routes authentifiées : les comptes de troisième sont admissibles ; la quatrième reste exclue du devoir DNB.
5. Avec des pseudonymes fictifs, ouvrir le devoir, saisir des réponses, couper puis rétablir le réseau, vérifier la confirmation, se reconnecter sur un autre appareil après sauvegarde. Tester une remise avec réponse manquante, puis une remise complète. Contrôler le diagnostic et les notes professeur. Vérifier aussi les routes de 4e.
6. Sur téléphone, tester portrait/paysage, taille 320 px, stockage désactivé, lecture locale fr-FR. Vérifier la lisibilité et la prononciation à l'oreille. Tester sur au moins deux types d'appareil.
7. Si la recette est concluante et autorisée par l'établissement, appliquer les migrations en production et déployer le Worker. Réutiliser la configuration existante, sans changer l'origine autorisée ni supprimer les données de 4e. Distribuer le lien dnb/?school=1 seulement à la classe pilote.
8. En cas d'incident, revenir à la version précédente du Worker ; la colonne supplémentaire peut rester. Ne pas supprimer la table dnb_attempts. Préserver les données.

## Limites
- Sauvegarde en ligne confirmée uniquement par le serveur ; les réponses non transmises restent en mémoire, et peuvent être perdues lors d'une fermeture forcée. Le navigateur avertit lorsque cela est possible.
- Le serveur calcule la note mais ne peut pas garantir l'absence d'aide extérieure. Le code du site et la banque sont publics. Les bilans locaux sont indicatifs.
- Le brevet blanc et Scratch restent des entraînements locaux. Les évaluations personnalisées sont imprimables. La rédaction libre est à vérifier par le professeur.
- Les tests SQLite/Playwright ne remplacent pas un test réel Cloudflare ni un audit RGPD. Les métriques de performances et la qualité sonore sur appareils physiques restent à mesurer.
