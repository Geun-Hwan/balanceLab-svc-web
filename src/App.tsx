import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import RouterFactory from "./RouterFactory";
import AlertComponent from "./elements/components/AlertComponent";
import { queryClient } from "./libs/queryClent";
import { useUserStore } from "./libs/store/store";

function App() {
  const { themeColor } = useUserStore();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withCssVariables
        withGlobalClasses
        withStaticClasses
        defaultColorScheme={themeColor}
      >
        <AlertComponent />

        <RouterFactory />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
