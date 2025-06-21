De client, server en reader zijn alle drie aparte bestanden. De reader is niet meer nodig op dit punt, maar heb ik nog steeds online gezet zodat mijn code inzichtbaar is.
De server moet een .env file hebben met de volgende informatie:
AZURE_OPENAI_API_VERSION=2025-03-01-preview
AZURE_OPENAI_API_INSTANCE_NAME=cmgt-ai
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_DEPLOYMENT_NAME=deploy-gpt-35-turbo
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=deploy-text-embedding-ada

In het AZURE_OPENAI_API_KEY veld moet een valid key worden toegevoegd. De gebruiker moet minstens een node versie hebben van 22. Daarna kan npm install en npm run start gerund worden.

Voor de client heeft de gebruiker alleen een live server nodig die moet worden aangezet.
