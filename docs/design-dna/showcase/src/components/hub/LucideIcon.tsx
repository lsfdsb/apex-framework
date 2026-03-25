import {
  Accessibility,
  Brain,
  Building,
  ClipboardList,
  Crown,
  Eye,
  FileCode,
  Gem,
  Hammer,
  Kanban,
  Lock,
  MessageCircle,
  Package,
  Palette,
  PenTool,
  Rocket,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  "accessibility": Accessibility,
  "brain": Brain,
  "building": Building,
  "clipboard-list": ClipboardList,
  "crown": Crown,
  "eye": Eye,
  "file-code": FileCode,
  "gem": Gem,
  "hammer": Hammer,
  "kanban": Kanban,
  "lock": Lock,
  "message-circle": MessageCircle,
  "package": Package,
  "palette": Palette,
  "pen-tool": PenTool,
  "rocket": Rocket,
  "search-check": SearchCheck,
  "shield-alert": ShieldAlert,
  "shield-check": ShieldCheck,
  "zap": Zap,
};

export function LucideIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span style={{ width: size, height: size, display: "inline-block" }} />;
  return <Icon size={size} />;
}
