import React from "react";
/*
    1. A Context object that will allow us to reference the context in child components

    2. A Context Provider that will wrap the child components that want access to the context
*/

export const AppContext = React.createContext();

const initialState = {
  theme: "default",
  ghostVotes: 0,
  clownVotes: 0,
};

const calculateNextTheme = (ghostVotes, clownVotes) => {
  if (ghostVotes > clownVotes) {
    return "green";
  } else if (ghostVotes < clownVotes) {
    return "red";
  } else {
    return "default";
  }
};

const stateReducer = (prevState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "CHANGE_THEME":
      return { ...prevState, theme: payload };
    case "VOTE_GHOST": {
      const ghostVotes = prevState.ghostVotes + 1;
      let nextTheme = calculateNextTheme(ghostVotes, prevState.clownVotes);
      return { ...prevState, ghostVotes, theme: nextTheme };
    }
    case "VOTE_CLOWN": {
      const clownVotes = prevState.clownVotes + 1;
      let nextTheme = calculateNextTheme(prevState.ghostVotes, clownVotes);
      return { ...prevState, clownVotes, theme: nextTheme };
    }
    default:
      throw new Error(`Unsupported action type: ${type}`);
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);
  const handleColorChange = (colorTheme) =>
    dispatch({ type: "CHANGE_THEME", payload: colorTheme });

  const voteGhost = () => dispatch({ type: "VOTE_GHOST" });
  const voteClown = () => dispatch({ type: "VOTE_CLOWN" });

  return (
    <AppContext.Provider
      value={{ ...state, handleColorChange, voteGhost, voteClown }}
    >
      {children}
    </AppContext.Provider>
  );
};
