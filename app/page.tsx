"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Film } from "lucide-react"
import moviesData from "@/data/complete-collection.json"

interface Movie {
  id: number
  title: string
  year: number
  genre: string
  type: string
  actors: string[]
}

export default function MovieDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("Alle")
  const movies: Movie[] = moviesData

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.actors.some(actor => actor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesType = true
    if (typeFilter !== "Alle") {
      matchesType = movie.type === typeFilter
      console.log(`Movie: ${movie.title}, Type: ${movie.type}, Filter: ${typeFilter}, Matches: ${matchesType}`)
    }
    
    return matchesSearch && matchesType
  })
  
  const movieCount = movies.filter(m => m.type === "Film").length
  const seriesCount = movies.filter(m => m.type === "Serie").length

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Film className="h-6 w-6" />
            Meine Sammlung
          </h1>
          <p className="text-sm text-muted-foreground">
            {movieCount} Filme • {seriesCount} Serienepisoden • {movies.length} insgesamt
          </p>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Suche nach Filmtitel, Schauspielern oder Genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["Alle", "Film", "Serie"].map((type) => (
              <Badge
                key={type}
                variant={typeFilter === type ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => setTypeFilter(type)}
              >
                {type === "Alle" ? `Alle (${movies.length})` : 
                 type === "Film" ? `Filme (${movieCount})` : 
                 `Serien (${seriesCount})`}
              </Badge>
            ))}
          </div>
          {(searchQuery || typeFilter !== "Alle") && (
            <p className="text-xs text-muted-foreground">
              {filteredMovies.length} {filteredMovies.length === 1 ? "Eintrag" : "Einträge"} gefunden
            </p>
          )}
        </div>

        {/* Movie List */}
        <div className="grid gap-2">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Card key={movie.id} className="transition-all hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{movie.title}</h3>
                    <p className="truncate text-sm text-muted-foreground">{movie.actors.join(", ")}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={movie.type === "Film" ? "default" : "destructive"} className="text-xs">
                      {movie.type || "Unbekannt"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {movie.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {movie.genre}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Search className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Keine Filme gefunden</p>
                <p className="text-sm text-muted-foreground">Versuche es mit einem anderen Suchbegriff</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
