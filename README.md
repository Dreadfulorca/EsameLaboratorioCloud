# Guida all'Implementazione di un'Applicazione WebGL Containerizzata con Autenticazione

## Panoramica del Sistema

Questo progetto realizza un'infrastruttura containerizzata per un'applicazione WebGL accessibile solo previa autenticazione. Tutti i componenti sono orchestrati tramite Docker Compose e isolati in container separati per una maggiore sicurezza e manutenibilità.

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

### Accesso al Database

Per connettersi al database MySQL:
```bash
docker compose exec mysql mysql -u $DB_USER -p $DB_NAME
```
### Stop servizi
Per fermare tutti i container in esecuzione:
```bash
docker compose down
```
## Considerazioni sulla Sicurezza

- Tutte le comunicazioni tra container avvengono su una rete Docker privata
- L'accesso all'applicazione WebGL è protetto da autenticazione
- Le credenziali del database sono gestite tramite Docker Secrets
- Solo il reverse proxy Nginx è esposto esternamente
