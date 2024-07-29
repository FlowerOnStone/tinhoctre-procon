import TournamentBracket from "@/components/bracket/page";
import GeneralTournamentPage from "@/components/tournament/general/page";

export default async function TournamentPage() {
  return (
    <div style={{margin: '3%'}}>
      <GeneralTournamentPage/>
      <TournamentBracket/>
    </div>
  )
}
