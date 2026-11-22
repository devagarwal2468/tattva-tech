import React from 'react';
import {
  Globe, Smartphone, Sparkles, Bot, PenTool, Layers, TrendingUp, Target, MessagesSquare, Users,
  LifeBuoy, Send, BarChart3, Cpu, Box, Code2, Zap, Rocket, ShieldCheck, Database, Mail,
} from 'lucide-react';

const icons = {
  Globe, Smartphone, Sparkles, Bot, PenTool, Layers, TrendingUp, Target, MessagesSquare, Users,
  LifeBuoy, Send, BarChart3, Cpu, Box, Code2, Zap, Rocket, ShieldCheck, Database, Mail,
};

/** Render a lucide icon by name (used for data-driven content, e.g. CMS products). */
export default function Icon({ name, fallback = 'Box', ...props }) {
  const Cmp = icons[name] || icons[fallback];
  return <Cmp aria-hidden="true" {...props} />;
}
