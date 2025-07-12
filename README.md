# Guida all'Implementazione di un'Applicazione WebGL Containerizzata con Autenticazione

## Panoramica del Sistema

Questo progetto realizza un'infrastruttura containerizzata per un'applicazione WebGL accessibile solo previa autenticazione. Tutti i componenti sono orchestrati tramite Docker Compose e isolati in container separati per una maggiore sicurezza e manutenibilità.

### Spiegazione del Sistema

Per il progetto ho realizzato un’infrastruttura containerizzata composta da più servizi: un sistema di autenticazione, un database MySQL, un reverse proxy Nginx e un’applicazione WebGL servita tramite Apache. 

L’autenticazione è gestita da un microservizio in Node.js con Express, che permette agli utenti di effettuare il login tramite una pagina HTML. 
Le credenziali vengono verificate confrontandole con i dati presenti nella tabella users nel database MySQL, e in caso di successo viene creata una sessione con express-session. 
Ogni accesso viene anche registrato nella tabella login_logs, salvando IP e browser dell’utente. 

Per connettersi al database, il backend legge la password tecnica del database da un Docker Secret, che viene montato nel container in modo sicuro. Il percorso di questo file viene passato tramite la variabile d’ambiente DB_PASSWORD_FILE. 
È importante sottolineare che questa non è la password dell’utente, ma quella usata dal backend per collegarsi a MySQL. 

Tutto il traffico esterno passa attraverso un reverse proxy Nginx, che ascolta sulla porta 8080. Nginx ha il compito di smistare le richieste ai vari container interni: ad esempio, quelle per il login al backend Node.js e quelle per l'applicazione WebGL verso Apache. 
Questo permette di isolare i container interni e di avere un unico punto di accesso, rendendo l’infrastruttura più sicura e modulare. 

Il database MySQL viene inizializzato automaticamente grazie a uno script init.sql che crea il database, le tabelle e tre utenti di test. I dati persistono grazie all’uso di volumi Docker, in modo da non essere persi al riavvio del container. 

Anche l’applicazione WebGL è stata containerizzata separatamente, utilizzando Apache come server web. I file statici vengono copiati in una directory esposta da Apache, e l’utente può accedervi solo dopo l’autenticazione, sempre passando per il reverse proxy. 

L’intera infrastruttura è orchestrata con Docker Compose che ci permette di lanciare, configurare, collegare i vari container in un rete privata e coordinarli tra loro, inoltre l'infrastruttura è stata configurata tramite variabili d’ambiente, che rendono il sistema facilmente portabile e adattabile. 
Solo i servizi essenziali vengono esposti, seguendo i principi di sicurezza per isolamento, e l’accesso alla WebGL App è protetto da autenticazione. 
## Componenti Principali

1. **Frontend**: Applicazione WebGL servita da Apache HTTP Server
2. **Backend**: Servizio Node.js/Express per l'autenticazione
3. **Database**: MySQL 8.0 per la gestione delle credenziali
4. **Reverse Proxy**: Nginx per gestire il traffico e l'accesso

## Configurazione Iniziale

### Requisiti di Sistema
- Docker Engine versione 20.10+
- Docker Compose versione 2.5+
- 1GB di spazio libero su disco
- Accesso alla porta 8080

### Preparazione dell'Ambiente

Clonare il repository:
   ```bash
   git clone https://github.com/Dreadfulorca/EsameLaboratorioCloud.git
   cd EsameLaboratorioCloud
   ```

## Deployment

Per avviare l'intera infrastruttura:
```bash
docker compose up -d 
```

## Verifica dello Stato

Controllare che tutti i servizi siano operativi:
```bash
docker compose ps
```

L'output dovrebbe mostrare tutti i container con stato "running".

## Accesso all'Applicazione

1. Aprire il browser all'indirizzo: `http://localhost:8080` (o la porta configurata)
2. Effettuare il login con le credenziali preconfigurate:

   | Username | Password   |
   |----------|------------|
   | admin    | admin123   |

3. Dopo l'autenticazione verrai reindirizzato automaticamente all'applicazione WebGL.

### Variabili d'Ambiente (.env)
- DB_NAME: Nome database MySQL
- DB_USER: Utente database
- NGINX_PORT: Porta di accesso (default: 8080)

### Stop servizi
Per fermare tutti i container in esecuzione:
```bash
docker compose down
```
## Considerazioni sulla Sicurezza

- Tutte le comunicazioni tra container avvengono su una rete Docker privata
- L'accesso all'applicazione WebGL è protetto da autenticazione
- Le credenziali del database sono gestite tramite Docker Secrets nel file secrets/db_password.txt
- Solo il reverse proxy Nginx è esposto esternamente
