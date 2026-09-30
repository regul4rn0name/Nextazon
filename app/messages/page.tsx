import { ChatPanel } from '../components/chat-panel';
import { getAccount } from '../lib/auth';
import { SignInPrompt } from '../components/sign-in-prompt';
import { PageShell } from '../components/page-shell';
export default async function Messages({searchParams}:PageProps<"/messages">) {
  const account=await getAccount();
  const query=await searchParams;
  if (!account) return <SignInPrompt title="Your island conversations start here." description="Sign in or create an account to access Chat." next="/messages" />;
  return <PageShell active="/messages"><div className="page-intro"><h1>Chat</h1><p>Arrange trades and keep in touch.</p></div><ChatPanel key={`${query.seller || ""}:${query.conversation || ""}`} userId={account.id} peerId={typeof query.seller==='string'?query.seller:undefined} conversationId={typeof query.conversation==='string'?query.conversation:undefined}/></PageShell>;
}
