import { createCanvas, loadImage } from "canvas";
import path from "path";
import { registerFont } from "canvas";
import { GuildMember } from "discord.js";
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

// Register the font
registerFont(path.join(__dirname, "./fonts/Cairo-Bold.ttf"), {
  family: "Cairo Bold",
});

const createWelcomeScreen = async (
  member: GuildMember,
  options: WelcomeScreenOptions
) => {
  const {
    backgroundColor,
    backgroundImageUrl,
    height,
    width,
    statusCircle,
    subtitleText,
    welcomeText,
    memberCountText,
    avatar: avatarOptions,
    overlay,
  } = options;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  if (backgroundImageUrl) {
    const backgroundImage = await loadImage(backgroundImageUrl);
    const aspectRatio = backgroundImage.width / backgroundImage.height;
    const canvasAspectRatio = width / height;

    let sourceWidth;
    let sourceHeight;
    let sourceX;
    let sourceY;

    if (aspectRatio > canvasAspectRatio) {
      // image is wider than canvas
      sourceWidth = backgroundImage.height * canvasAspectRatio;
      sourceHeight = backgroundImage.height;
      sourceX = (backgroundImage.width - sourceWidth) / 2;
      sourceY = 0;
    } else {
      // image is taller than canvas
      sourceWidth = backgroundImage.width;
      sourceHeight = backgroundImage.width / canvasAspectRatio;
      sourceX = 0;
      sourceY = (backgroundImage.height - sourceHeight) / 3;
    }

    context.drawImage(
      backgroundImage,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      width,
      height
    );
  }

  if (backgroundImageUrl && overlay?.opacity && overlay.margin) {
    context.save();
    context.fillStyle = `rgba(0, 0, 0, ${overlay.opacity})`;
    context.fillRect(
      overlay.margin,
      overlay.margin,
      width - overlay.margin - overlay.margin,
      height - overlay.margin - overlay.margin
    );
    context.restore();
  }

  const avatar = await loadImage(
    member.user.displayAvatarURL({ extension: "png" })
  );

  // Draw the avatar image as a circle.

  context.save();
  context.beginPath();
  context.arc(
    avatarOptions.x,
    avatarOptions.y,
    avatarOptions.radius,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  context.clip();
  context.drawImage(
    avatar,
    avatarOptions.x - avatarOptions.radius,
    avatarOptions.y - avatarOptions.radius,
    avatarOptions.radius * 2,
    avatarOptions.radius * 2
  );
  context.restore();

  // Draw the status circle
  context.beginPath();
  context.arc(
    statusCircle.x,
    statusCircle.y,
    statusCircle.radius,
    0,
    Math.PI * 2,
    true
  );
  context.closePath();
  const statusColors = {
    online: "#43b581",
    idle: "#faa61a",
    dnd: "#f04747",
    offline: "#747f8d",
    invisible: "#747f8d",
  };
  const memberStatus = member.presence?.status!;
  const statusColor: string = statusColors[memberStatus];
  context.fillStyle = statusColor;
  context.fill();
  context.globalAlpha = 0.2;
  context.fillStyle = "#f4d03f";
  context.fill();
  context.globalAlpha = 1;

  // Draw the welcome text
  if (welcomeText) {
    context.fillStyle = welcomeText.color;
    context.textAlign = welcomeText.align || "center";
    context.font = `${welcomeText.size}px ${welcomeText.font}`;
    context.fillText(
      welcomeText.text
        .replace("{username}", member.user.username)
        .replace("{server}", member.guild.name),
      welcomeText.x,
      welcomeText.y
    );
  }
  // Draw the subtitle text
  if (subtitleText) {
    context.fillStyle = subtitleText.color;
    context.textAlign = subtitleText.align || "center";
    context.font = `${subtitleText.size}px ${subtitleText.font}`;
    context.fillText(subtitleText.text, subtitleText.x, subtitleText.y);
  }
  // Draw the member count text
  if (memberCountText) {
    context.fillStyle = memberCountText.color;
    context.textAlign = memberCountText.align || "center";
    context.font = `${memberCountText.size}px ${memberCountText.font}`;
    context.fillText(
      memberCountText.text.replace(
        "{count}",
        member.guild.memberCount.toString()
      ),
      memberCountText.x,
      memberCountText.y
    );
  }
  // Convert the canvas to a PNG image and return it as a buffer
  const buffer = canvas.toBuffer("image/png");
  return buffer;
};

export default createWelcomeScreen;
