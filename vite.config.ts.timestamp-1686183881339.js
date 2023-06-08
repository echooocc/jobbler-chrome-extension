// vite.config.ts
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import zipPack from "vite-plugin-zip-pack";

// src/manifest.ts
import { defineManifest } from "@crxjs/vite-plugin";
var manifest_default = defineManifest({
  name: "create-chrome-ext",
  description: "",
  version: "0.0.0",
  manifest_version: 3,
  icons: {
    "16": "img/logo-16.png",
    "32": "img/logo-34.png",
    "48": "img/logo-48.png",
    "128": "img/logo-128.png"
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo-48.png"
  },
  options_page: "options.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/content/index.ts"]
    }
  ],
  web_accessible_resources: [
    {
      resources: ["img/logo-16.png", "img/logo-34.png", "img/logo-48.png", "img/logo-128.png"],
      matches: []
    }
  ],
  permissions: [
    "tabs",
    "activeTab",
    scripting
  ]
});

// src/read_pages_folder.ts
import globSync from "glob";
var pages = await globSync("pages/*.html");
var arrayKeyValuePairs = pages.map((file) => [file.split("\\").slice(-1).toString().split(".html").join(""), file]);
var config = Object.fromEntries(arrayKeyValuePairs);

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        input: config,
        output: {
          chunkFileNames: "assets/chunk-[hash].js"
        }
      }
    },
    plugins: [crx({ manifest: manifest_default }), react(), zipPack({
      outDir: `package`,
      inDir: "build",
      outFileName: `${manifest_default.short_name ?? manifest_default.name.replaceAll(" ", "-")}-extension-v${manifest_default.version}.zip`
    })]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIiwgInNyYy9yZWFkX3BhZ2VzX2ZvbGRlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB6aXBQYWNrIGZyb20gJ3ZpdGUtcGx1Z2luLXppcC1wYWNrJztcblxuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vc3JjL21hbmlmZXN0J1xuLy9AdHMtaWdub3JlXG5pbXBvcnQge2NvbmZpZ30gZnJvbSAnLi9zcmMvcmVhZF9wYWdlc19mb2xkZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDogY29uZmlnLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9jaHVuay1baGFzaF0uanMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcGx1Z2luczogW2NyeCh7IG1hbmlmZXN0IH0pLCByZWFjdCgpLHppcFBhY2soe1xuICAgICAgICBvdXREaXI6IGBwYWNrYWdlYCxcbiAgICAgICAgaW5EaXI6ICdidWlsZCcsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgb3V0RmlsZU5hbWU6IGAke21hbmlmZXN0LnNob3J0X25hbWUgPz8gbWFuaWZlc3QubmFtZS5yZXBsYWNlQWxsKFwiIFwiLCBcIi1cIil9LWV4dGVuc2lvbi12JHttYW5pZmVzdC52ZXJzaW9ufS56aXBgLFxuICAgICAgfSksXSxcbiAgfVxufSlcbiIsICJpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lTWFuaWZlc3Qoe1xuICBuYW1lOiAnY3JlYXRlLWNocm9tZS1leHQnLFxuICBkZXNjcmlwdGlvbjogJycsXG4gIHZlcnNpb246ICcwLjAuMCcsXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIGljb25zOiB7XG4gICAgJzE2JzogJ2ltZy9sb2dvLTE2LnBuZycsXG4gICAgJzMyJzogJ2ltZy9sb2dvLTM0LnBuZycsXG4gICAgJzQ4JzogJ2ltZy9sb2dvLTQ4LnBuZycsXG4gICAgJzEyOCc6ICdpbWcvbG9nby0xMjgucG5nJyxcbiAgfSxcbiAgYWN0aW9uOiB7XG4gICAgZGVmYXVsdF9wb3B1cDogJ3BvcHVwLmh0bWwnLFxuICAgIGRlZmF1bHRfaWNvbjogJ2ltZy9sb2dvLTQ4LnBuZycsXG4gIH0sXG4gIG9wdGlvbnNfcGFnZTogJ29wdGlvbnMuaHRtbCcsXG4gIGJhY2tncm91bmQ6IHtcbiAgICBzZXJ2aWNlX3dvcmtlcjogJ3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzJyxcbiAgICB0eXBlOiAnbW9kdWxlJyxcbiAgfSxcbiAgY29udGVudF9zY3JpcHRzOiBbXG4gICAge1xuICAgICAgbWF0Y2hlczogWydodHRwOi8vKi8qJywgJ2h0dHBzOi8vKi8qJ10sXG4gICAgICBqczogWydzcmMvY29udGVudC9pbmRleC50cyddLFxuICAgIH0sXG4gIF0sXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xuICAgIHtcbiAgICAgIHJlc291cmNlczogWydpbWcvbG9nby0xNi5wbmcnLCAnaW1nL2xvZ28tMzQucG5nJywgJ2ltZy9sb2dvLTQ4LnBuZycsICdpbWcvbG9nby0xMjgucG5nJ10sXG4gICAgICBtYXRjaGVzOiBbXSxcbiAgICB9LFxuICBdLFxuICBwZXJtaXNzaW9uczogW1xuICAgIFwidGFic1wiLFxuICAgIFwiYWN0aXZlVGFiXCIsXG4gICAgc2NyaXB0aW5nXG4gIF0sXG59KVxuIiwgImltcG9ydCBnbG9iU3luYyBmcm9tICdnbG9iJztcblxuY29uc3QgcGFnZXMgPSBhd2FpdCBnbG9iU3luYygncGFnZXMvKi5odG1sJylcblxuY29uc3QgYXJyYXlLZXlWYWx1ZVBhaXJzID0gcGFnZXMubWFwKGZpbGUgPT4gW2ZpbGUuc3BsaXQoJ1xcXFwnKS5zbGljZSgtMSkudG9TdHJpbmcoKS5zcGxpdCgnLmh0bWwnKS5qb2luKCcnKSwgZmlsZV0pXG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSBPYmplY3QuZnJvbUVudHJpZXMoYXJyYXlLZXlWYWx1ZVBhaXJzKVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsV0FBVztBQUNwQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhOzs7QUNIcEIsU0FBUyxzQkFBc0I7QUFFL0IsSUFBTyxtQkFBUSxlQUFlO0FBQUEsRUFDNUIsTUFBTTtBQUFBLEVBQ04sYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1Qsa0JBQWtCO0FBQUEsRUFDbEIsT0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWU7QUFBQSxJQUNmLGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsSUFDaEIsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLGlCQUFpQjtBQUFBLElBQ2Y7QUFBQSxNQUNFLFNBQVMsQ0FBQyxjQUFjLGFBQWE7QUFBQSxNQUNyQyxJQUFJLENBQUMsc0JBQXNCO0FBQUEsSUFDN0I7QUFBQSxFQUNGO0FBQUEsRUFDQSwwQkFBMEI7QUFBQSxJQUN4QjtBQUFBLE1BQ0UsV0FBVyxDQUFDLG1CQUFtQixtQkFBbUIsbUJBQW1CLGtCQUFrQjtBQUFBLE1BQ3ZGLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQUEsRUFDQSxhQUFhO0FBQUEsSUFDWDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBQ3ZDRCxPQUFPLGNBQWM7QUFFckIsSUFBTSxRQUFRLE1BQU0sU0FBUyxjQUFjO0FBRTNDLElBQU0scUJBQXFCLE1BQU0sSUFBSSxVQUFRLENBQUMsS0FBSyxNQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBRTNHLElBQU0sU0FBUyxPQUFPLFlBQVksa0JBQWtCOzs7QUZJM0QsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsU0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0wsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsT0FBTztBQUFBLFFBQ1AsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUyxDQUFDLElBQUksRUFBRSwyQkFBUyxDQUFDLEdBQUcsTUFBTSxHQUFFLFFBQVE7QUFBQSxNQUN6QyxRQUFRO0FBQUEsTUFDUixPQUFPO0FBQUEsTUFFUCxhQUFhLEdBQUcsaUJBQVMsY0FBYyxpQkFBUyxLQUFLLFdBQVcsS0FBSyxHQUFHLGdCQUFnQixpQkFBUztBQUFBLElBQ25HLENBQUMsQ0FBRTtBQUFBLEVBQ1A7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
