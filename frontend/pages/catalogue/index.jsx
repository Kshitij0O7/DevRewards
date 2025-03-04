import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { PublicRepoCard } from "@/components/public-repo-card"
import { ethers } from "ethers";
import { AppContext } from "@/components/Global-States";
import ErrorPage from "next/error";
import { Loader2 } from "lucide-react";
export default function CataloguePage() {
  const { isConnected, } = useAccount();
  const { contract, isContract } = useContext(AppContext)
  const [repoloading, setRepoLoading] = useState(true);
  const [repos, setRepos] = useState([]);


  const loadRepos = async (st) => {
    try {
      const data = await contract.getPublicRepos();
      setRepos(data);
    } catch (e) {
      console.log(e);
    }
    setRepoLoading(false);
  }

  useEffect(() => {
    if (isContract) {
      loadRepos();
    }
  }, [isContract])

  if (!isConnected) {
    return <ErrorPage statusCode={404} title="Try connecting your wallet" />
  }

  return (
    <>
      <div className="container grid-cols-3">
        <h1 className="text-3xl mt-20 text-right font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Check out Awesome Repositories <br className="hidden sm:inline" />
          in the world of open source.
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 m-10">
          {repoloading ? (
            <div ClassName="flex items-center justify-center">
              <div ClassName="text-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </div>
          ) : <>
            {repos.map((repo) => {
              if (repo.isPresent) {
                return <PublicRepoCard key={repo.repoId} repo={{
                  ...repo,
                  balance: ethers.utils.formatEther(repo.balance),
                  commits: repo.commits.toNumber(),
                  rewardsGiven: ethers.utils.formatEther(repo.rewardsGiven),
                }} fetchRepo={loadRepos} />
              }
            })}

          </>}

        </div>
      </div>

    </>
  )
}