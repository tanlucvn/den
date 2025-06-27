import { db } from "@/db";
import { todosTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (!user)
    return (
      <div>
        <SignInButton />
        Not signed in
      </div>
    );

  const data = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.userId, user.id));
  return (
    <div>
      Hello {user?.firstName}
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.id}</li>
        ))}
      </ul>
    </div>
  );
}
