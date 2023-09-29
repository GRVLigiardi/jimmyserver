const express = require('express');
const path = require('path');
const cors = require('cors');
const CharacterAI = require('node_characterai');
const corsOptions = {
    origin: 'https://jimmypalabre.azurewebsites.net',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

const app = express();
app.use('/public', express.static('public'));
app.use(cors(corsOptions));
app.use(express.json());

const characterAI = new CharacterAI();

// authentifier en tant qu'invité
/*
characterAI.authenticateAsGuest().then(() => {
    console.log("Authenticated as guest!");
}).catch(err => {
    console.error("Authentication failed:", err);
});
*/
// authentifier avec un token

const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVqYmxXUlVCWERJX0dDOTJCa2N1YyJ9.eyJpc3MiOiJodHRwczovL2NoYXJhY3Rlci1haS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDAyMjM1NjUyMTMxNjAxMjg1NjMiLCJhdWQiOlsiaHR0cHM6Ly9hdXRoMC5jaGFyYWN0ZXIuYWkvIiwiaHR0cHM6Ly9jaGFyYWN0ZXItYWkudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY5NDAyODQwNiwiZXhwIjoxNjk2NjIwNDA2LCJhenAiOiJkeUQzZ0UyODFNcWdJU0c3RnVJWFloTDJXRWtucVp6diIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.sp_FZe4rt7GUOFmrfs5WnpGhlSKyyDhWZpw8TuGgOk1H_uoSQX2_1Ob9gwNJ9t08KVybN-idELc9BRq0bT1dWTY-RmffVEu68uFhXH7FD6ogyqXN-Fs_tbwu6bUzt6E37V65JUx7b51-ttwQoDftUFMuTxzXFLy9hOxZX2EUz4O653kuA6MJMFXaJpSCiWaIg1X5mPb306VC9wlyj0S6mLNX0-HNQHvt47WcjinzTa28OdyX3kPtC84TGt85n_4NDnNhngwPBrOyH5e9duldCrDq2MhBmUVy0TRb3cTbRm6TOA1Y10SQey5C7LmRUFBsqWSKLwq3j9o6o1RyOZR8Og';
characterAI.authenticateWithToken(token).then(() => {
    console.log("Authenticated with token!");
}).catch(err => {
    console.error("Token authentication failed:", err);
});

app.post('/chat', async (req, res) => {
    console.log("Received request body: ", req.body); 
    try {
        const characterId = req.body.characterId;
        const message = req.body.message;

        console.log('CharacterId:', characterId); // Log characterId
        console.log('Message:', message); // Log message
        
        if (!characterId || !message) {
            return res.status(400).json({ error: 'characterId and message are required' });
        }
        
        const chat = await characterAI.createOrContinueChat(characterId);
        const response = await chat.sendAndAwaitResponse(message, true);

        res.json({ responseText: response.text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});