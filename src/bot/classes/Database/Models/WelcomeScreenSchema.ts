import { Document, Schema, model } from "mongoose";

interface WelcomeScreenAvatar {
  radius: number;
  x: number;
  y: number;
}

interface WelcomeScreenStatusCircle {
  radius: number;
  margin: number;
  x: number;
  y: number;
}

export interface WelcomeScreenText {
  color: string;
  text: string;
  size: number;
  font: string;
  x: number;
  y: number;
  align?: CanvasTextAlign;
}

export interface WelcomeScreenOptions {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImageUrl: string;
  avatar: WelcomeScreenAvatar;
  statusCircle: WelcomeScreenStatusCircle;
  welcomeText: WelcomeScreenText;
  subtitleText: WelcomeScreenText;
  memberCountText?: WelcomeScreenText;
  overlay?: {
    opacity: number;
    margin: number;
  };
}

interface WelcomeScreenOptionsDocument extends WelcomeScreenOptions, Document {}

const WelcomeScreenOptionsSchema = new Schema<WelcomeScreenOptionsDocument>({
  width: { type: Number, default: 600 },
  height: { type: Number, default: 400 },
  backgroundColor: { type: String, default: "#333333" },
  backgroundImageUrl: { type: String, default: "" },
  avatar: {
    radius: { type: Number, default: 100 },
    x: { type: Number, default: 300 },
    y: { type: Number, default: 120 },
  },
  statusCircle: {
    radius: { type: Number, default: 25 },
    margin: { type: Number, default: 10 },
    x: { type: Number, default: 350 },
    y: { type: Number, default: 200 },
  },
  welcomeText: {
    color: { type: String, default: "#ffffff" },
    text: { type: String, default: "Welcome {username} to {server}" },
    size: { type: Number, default: 28 },
    font: { type: String, default: "Cairo Bold" },
    x: { type: Number, default: 300 },
    y: { type: Number, default: 275 },
    align: { type: String, default: "center" },
  },
  subtitleText: {
    color: { type: String, default: "#ffffff" },
    text: { type: String, default: "We're glad to have you here." },
    size: { type: Number, default: 16 },
    font: { type: String, default: "Cairo Bold" },
    x: { type: Number, default: 300 },
    y: { type: Number, default: 300 },
    align: { type: String, default: "center" },
  },
  memberCountText: {
    color: { type: String, default: "#ffffff" },
    text: { type: String, default: "You are member #{count}" },
    size: { type: Number, default: 28 },
    font: { type: String, default: "Arial" },
    x: { type: Number, default: 300 },
    y: { type: Number, default: 350 },
    align: { type: String, default: "center" },
  },
  overlay: {
    opacity: { type: Number, default: 0.75 },
    margin: { type: Number, default: 15 },
  },
});

export default model<WelcomeScreenOptionsDocument>(
  "WelcomeScreens",
  WelcomeScreenOptionsSchema
);
