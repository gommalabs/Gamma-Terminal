import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => null,
  ssr: false,
  beforeLoad: async () => {
    throw redirect({ to: "/terminal" });
  },
});
