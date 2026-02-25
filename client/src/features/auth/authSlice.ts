import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  email: string;
  name: string;
  profilePicture: string;
}

interface ReportSetting {
  userId?: string;
  frequency?: string;
  isEnabled: boolean;
}

interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  user: User | null;
  reportSetting: ReportSetting | null;
}

const initialState: AuthState = {
  accessToken: null,
  expiresAt: null,
  user: null,
  reportSetting: null,
};

type PayloadActionType = PayloadAction<{
  accessToken?: string | null;
  expiresAt?: number | null;
  user?: User | null;
  reportSetting?: ReportSetting | null;
}>;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadActionType) => {
      console.log("AUTH SLICE", action.payload);
      const { accessToken, expiresAt, user, reportSetting } = action.payload;

      if (accessToken !== undefined) state.accessToken = accessToken;
      if (expiresAt !== undefined) state.expiresAt = expiresAt;
      if (user !== undefined) {
        state.user = state.user ? { ...state.user, ...user } : user;
      }

      if (reportSetting !== undefined) {
        state.reportSetting = state.reportSetting
          ? { ...state.reportSetting, ...reportSetting }
          : reportSetting;
      }
    },
    updateCredentials: (state, action: PayloadActionType) => {
      console.log("AUTH SLICE", action.payload);

      const { accessToken, expiresAt, user, reportSetting } = action.payload;

      if (accessToken !== undefined) state.accessToken = accessToken;
      if (expiresAt !== undefined) state.expiresAt = expiresAt;
      if (user !== undefined) {
        state.user = state.user ? { ...state.user, ...user } : user;
      }

      if (reportSetting !== undefined) {
        state.reportSetting = state.reportSetting
          ? { ...state.reportSetting, ...reportSetting }
          : reportSetting;
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
      state.reportSetting = null;
    },
  },
});

export const { setCredentials, updateCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
