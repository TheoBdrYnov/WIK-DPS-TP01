npm init -y 
npm install --save-dev typescript @types/node
npm install --save-dev tsx
On fait le server.ts puis :
npm run dev
ou
PING_LISTEN_PORT=un_port npm run dev

Puis on fait :
curl -i http://localhost:8000/ping
Qui renvoie :
└─$ curl -i http://localhost:8000/ping
HTTP/1.1 200 OK
Content-Type: application/json
Date: Wed, 03 Jun 2026 09:32:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"host":"localhost:8000","user-agent":"curl/8.15.0","accept":"*/*"}                                                                                                                                                 

Puis :
└─$ curl -i http://localhost:8000/autre
HTTP/1.1 404 Not Found
Date: Wed, 03 Jun 2026 09:33:16 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

Bonus :
J'ai mis en place une interface "interface CounterStore", qui permet de partir sur une vraie base de données et non pas en mémoire juste en rajoutant une classe.
Le serveur renvoie bien quelque chose de la forme suivante quand on va sur le /stats :
{"requests":11,"uptime":703,"instance":"Host-002"}

Les requêtes sur /stats lui même font aussi augmenter le compteur (pareil pour les requêtes générant un 404).

Quand deux serveurs sont lancés avec :
npm run dev (par défaut sur le port 8000)
et
PING_LISTEN_PORT=8008 npm run dev

Les deux compteurs sont décorrélés (logique puisque chaque compteur est dans la mémoire de son propre process).
Exemple :
Sur le serveur 1 :
{"requests":22,"uptime":1113,"instance":"Host-002"}

Et sur le 2 juste après :
{"requests":12,"uptime":1015,"instance":"Host-002"}

Solution possible pour que les compteurs se suivent : Redis.
On fait en sorte tous les process pointent vers le même redis