import { createSlice ,type PayloadAction} from "@reduxjs/toolkit"

interface AuthState{
    user: any | null,
    token: string | null,
    isAuthenticated: boolean,
    role: string | null
}

const initialState:AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials:(state,action:PayloadAction<{user: any, token:string,role: string}>)=>{
            state.user = action.payload;
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        }
    }
})

export const{setCredentials} = authSlice.actions;
export default authSlice.reducer