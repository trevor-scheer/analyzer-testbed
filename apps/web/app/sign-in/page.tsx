"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      trainer {
        id
        name
      }
    }
  }
`;

export default function SignInPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  const [signIn, { loading, error }] = useMutation(SIGN_IN, {
    onCompleted() {
      router.push("/teams");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    signIn({ variables: { input: { name: name.trim() } } });
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm text-[var(--text-muted)] mb-1">
              Trainer Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ash Ketchum"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              required
              minLength={2}
              maxLength={30}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error.message}</p>}
          <Button type="submit" loading={loading} disabled={!name.trim()}>
            Enter PokéForge
          </Button>
        </form>
      </Card>
    </div>
  );
}
