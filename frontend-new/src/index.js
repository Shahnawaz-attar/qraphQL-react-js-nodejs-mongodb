// Import the necessary packages from React and Apollo Client
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { createHttpLink } from "@apollo/client/link/http";

// Create an http link to your GraphQL server
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // Your GraphQL server URL
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// Create a root element for rendering the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using the Apollo Client provider
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
