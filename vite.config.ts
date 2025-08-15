import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
<<<<<<< HEAD
=======

>>>>>>> b1e59ff (chore: initial commit (re-init at project root))
export default defineConfig(({ mode }) => ({
  // GitHub Pages용 public 경로 (dev에서는 영향 거의 없음)
  base: "/prototyping-site/",
  server: { host: "::", port: 8080 },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
<<<<<<< HEAD
}));
=======
}));
>>>>>>> b1e59ff (chore: initial commit (re-init at project root))
