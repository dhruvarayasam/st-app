const { createContext, useState } = require("react");

export const AlpacaAuthStatus = createContext(false)

export function AlpacaAuthStatusProvider ({children}) {

    const [APCA_AUTH_STATUS, setAPCA_AUTH_STATUS] = useState(false);

    return (
        <AlpacaAuthStatus.Provider value={{APCA_AUTH_STATUS, setAPCA_AUTH_STATUS}}>
            {children}
        </AlpacaAuthStatus.Provider>
    );
}