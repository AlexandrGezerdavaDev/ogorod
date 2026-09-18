"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useKbSpecies } from "@/features/kb/use-kb-species"
import { useI18n } from "@/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function manageKb(
  entity: string,
  operation: "upsert" | "delete",
  payload: Record<string, unknown>
) {
  const response = await fetch("/api/kb/manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity, operation, payload }),
  })
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(data?.error ?? "failed")
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
}

export function KbAdminView() {
  const { messages: m } = useI18n()
  const kb = useKbSpecies()
  const queryClient = useQueryClient()
  const [busy, setBusy] = React.useState(false)

  async function run(
    entity: string,
    operation: "upsert" | "delete",
    payload: Record<string, unknown>,
    successMessage: string
  ) {
    setBusy(true)
    try {
      await manageKb(entity, operation, payload)
      await queryClient.invalidateQueries({ queryKey: ["kb", "species"] })
      toast.success(successMessage)
    } catch {
      toast.error(operation === "delete" ? m.kbAdmin.deleteFailed : m.kbAdmin.saveFailed)
    } finally {
      setBusy(false)
    }
  }

  if (kb.isPending) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  const data = kb.data
  if (!data) {
    return null
  }

  return (
    <Tabs defaultValue="species" className="gap-4">
      <TabsList variant="line" className="w-full flex-wrap">
        <TabsTrigger value="species">{m.kbAdmin.tabs.species}</TabsTrigger>
        <TabsTrigger value="cultivars">{m.kbAdmin.tabs.cultivars}</TabsTrigger>
        <TabsTrigger value="diseases">{m.kbAdmin.tabs.diseases}</TabsTrigger>
        <TabsTrigger value="links">{m.kbAdmin.tabs.links}</TabsTrigger>
      </TabsList>

      <TabsContent value="species">
        <SpeciesTab
          species={data.species}
          busy={busy}
          onSave={(payload) => run("species", "upsert", payload, m.kbAdmin.saved)}
          onDelete={(id) => run("species", "delete", { id }, m.kbAdmin.deleted)}
        />
      </TabsContent>

      <TabsContent value="cultivars">
        <CultivarsTab
          species={data.species}
          cultivars={data.cultivars}
          busy={busy}
          onSave={(payload) => run("cultivar", "upsert", payload, m.kbAdmin.saved)}
          onDelete={(id) => run("cultivar", "delete", { id }, m.kbAdmin.deleted)}
        />
      </TabsContent>

      <TabsContent value="diseases">
        <DiseasesTab
          diseases={data.diseases}
          busy={busy}
          onSave={(payload) => run("disease", "upsert", payload, m.kbAdmin.saved)}
          onDelete={(id) => run("disease", "delete", { id }, m.kbAdmin.deleted)}
        />
      </TabsContent>

      <TabsContent value="links">
        <LinksTab
          data={data}
          busy={busy}
          onToggleClassification={(speciesId, valueId, enabled) =>
            run(
              "species_classification",
              enabled ? "upsert" : "delete",
              { speciesId, classificationValueId: valueId },
              m.kbAdmin.saved
            )
          }
          onToggleDisease={(speciesId, diseaseId, enabled) =>
            run(
              "species_disease",
              enabled ? "upsert" : "delete",
              { speciesId, diseaseId },
              m.kbAdmin.saved
            )
          }
          onSaveCare={(payload) =>
            run("care_profile", "upsert", payload, m.kbAdmin.saved)
          }
        />
      </TabsContent>
    </Tabs>
  )
}

function SpeciesTab({
  species,
  busy,
  onSave,
  onDelete,
}: {
  species: Array<{
    id: string
    scientificName: string
    commonNameUk: string
    commonNameEn?: string | null
  }>
  busy: boolean
  onSave: (payload: Record<string, unknown>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const { messages: m } = useI18n()
  const [id, setId] = React.useState("")
  const [scientificName, setScientificName] = React.useState("")
  const [commonNameUk, setCommonNameUk] = React.useState("")
  const [commonNameEn, setCommonNameEn] = React.useState("")

  function fill(row: (typeof species)[number]) {
    setId(row.id)
    setScientificName(row.scientificName)
    setCommonNameUk(row.commonNameUk)
    setCommonNameEn(row.commonNameEn ?? "")
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{m.kbAdmin.tabs.species}</CardTitle>
          <CardDescription>{m.pages.kb.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>{m.kbAdmin.id}</FieldLabel>
              <Input
                value={id}
                onChange={(event) => setId(event.target.value)}
                placeholder="kb_species_..."
              />
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.scientificName}</FieldLabel>
              <Input
                value={scientificName}
                onChange={(event) => {
                  setScientificName(event.target.value)
                  if (!id) {
                    setId(`kb_species_${slugify(event.target.value)}`)
                  }
                }}
              />
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.commonNameUk}</FieldLabel>
              <Input
                value={commonNameUk}
                onChange={(event) => setCommonNameUk(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.commonNameEn}</FieldLabel>
              <Input
                value={commonNameEn}
                onChange={(event) => setCommonNameEn(event.target.value)}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={busy}
                onClick={() =>
                  void onSave({
                    id,
                    scientificName,
                    commonNameUk,
                    commonNameEn,
                  })
                }
              >
                {m.kbAdmin.save}
              </Button>
              <Button
                variant="destructive"
                disabled={busy || !id}
                onClick={() => void onDelete(id)}
              >
                {m.kbAdmin.delete}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{species.length}</CardTitle>
        </CardHeader>
        <CardContent className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto">
          {species.length === 0 ? (
            <p className="text-sm text-muted-foreground">{m.kbAdmin.empty}</p>
          ) : (
            species.map((row) => (
              <button
                key={row.id}
                type="button"
                className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted/40"
                onClick={() => fill(row)}
              >
                <div className="font-medium">{row.commonNameUk}</div>
                <div className="text-muted-foreground">{row.scientificName}</div>
              </button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CultivarsTab({
  species,
  cultivars,
  busy,
  onSave,
  onDelete,
}: {
  species: Array<{ id: string; commonNameUk: string }>
  cultivars: Array<{ id: string; speciesId: string; name: string }>
  busy: boolean
  onSave: (payload: Record<string, unknown>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const { messages: m } = useI18n()
  const [id, setId] = React.useState("")
  const [speciesId, setSpeciesId] = React.useState(species[0]?.id ?? "")
  const [name, setName] = React.useState("")

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <FieldGroup>
            <Field>
              <FieldLabel>{m.kbAdmin.id}</FieldLabel>
              <Input value={id} onChange={(event) => setId(event.target.value)} />
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.speciesId}</FieldLabel>
              <NativeSelect
                value={speciesId}
                onChange={(event) => setSpeciesId(event.target.value)}
              >
                {species.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.commonNameUk}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.cultivarName}</FieldLabel>
              <Input
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  if (!id) {
                    setId(`kb_cultivar_${slugify(event.target.value)}`)
                  }
                }}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={busy}
                onClick={() => void onSave({ id, speciesId, name })}
              >
                {m.kbAdmin.save}
              </Button>
              <Button
                variant="destructive"
                disabled={busy || !id}
                onClick={() => void onDelete(id)}
              >
                {m.kbAdmin.delete}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto pt-6">
          {cultivars.map((row) => (
            <button
              key={row.id}
              type="button"
              className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted/40"
              onClick={() => {
                setId(row.id)
                setSpeciesId(row.speciesId)
                setName(row.name)
              }}
            >
              <div className="font-medium">{row.name}</div>
              <div className="text-muted-foreground">{row.speciesId}</div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function DiseasesTab({
  diseases,
  busy,
  onSave,
  onDelete,
}: {
  diseases: Array<{ id: string; nameUk: string; nameEn?: string | null }>
  busy: boolean
  onSave: (payload: Record<string, unknown>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const { messages: m } = useI18n()
  const [id, setId] = React.useState("")
  const [nameUk, setNameUk] = React.useState("")
  const [nameEn, setNameEn] = React.useState("")

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <FieldGroup>
            <Field>
              <FieldLabel>{m.kbAdmin.id}</FieldLabel>
              <Input value={id} onChange={(event) => setId(event.target.value)} />
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.diseaseNameUk}</FieldLabel>
              <Input
                value={nameUk}
                onChange={(event) => {
                  setNameUk(event.target.value)
                  if (!id) {
                    setId(`kb_disease_${slugify(event.target.value)}`)
                  }
                }}
              />
            </Field>
            <Field>
              <FieldLabel>{m.kbAdmin.diseaseNameEn}</FieldLabel>
              <Input
                value={nameEn}
                onChange={(event) => setNameEn(event.target.value)}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={busy}
                onClick={() => void onSave({ id, nameUk, nameEn })}
              >
                {m.kbAdmin.save}
              </Button>
              <Button
                variant="destructive"
                disabled={busy || !id}
                onClick={() => void onDelete(id)}
              >
                {m.kbAdmin.delete}
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex max-h-[28rem] flex-col gap-2 overflow-y-auto pt-6">
          {diseases.map((row) => (
            <button
              key={row.id}
              type="button"
              className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted/40"
              onClick={() => {
                setId(row.id)
                setNameUk(row.nameUk)
                setNameEn(row.nameEn ?? "")
              }}
            >
              {row.nameUk}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function LinksTab({
  data,
  busy,
  onToggleClassification,
  onToggleDisease,
  onSaveCare,
}: {
  data: NonNullable<ReturnType<typeof useKbSpecies>["data"]>
  busy: boolean
  onToggleClassification: (
    speciesId: string,
    valueId: string,
    enabled: boolean
  ) => Promise<void>
  onToggleDisease: (
    speciesId: string,
    diseaseId: string,
    enabled: boolean
  ) => Promise<void>
  onSaveCare: (payload: Record<string, unknown>) => Promise<void>
}) {
  const { messages: m } = useI18n()
  const [speciesId, setSpeciesId] = React.useState(data.species[0]?.id ?? "")
  const care = data.careProfiles.find((row) => row.speciesId === speciesId)
  const [imageUrl, setImageUrl] = React.useState(care?.imageUrl ?? "")

  React.useEffect(() => {
    const next = data.careProfiles.find((row) => row.speciesId === speciesId)
    setImageUrl(next?.imageUrl ?? "")
  }, [speciesId, data.careProfiles])

  const linkedValues = new Set(
    data.speciesClassifications
      .filter((row) => row.speciesId === speciesId)
      .map((row) => row.classificationValueId)
  )
  const linkedDiseases = new Set(
    data.speciesDiseases
      .filter((row) => row.speciesId === speciesId)
      .map((row) => row.diseaseId)
  )
  const groups = data.classificationGroups

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="pt-6">
          <Field>
            <FieldLabel>{m.kbAdmin.selectSpecies}</FieldLabel>
            <NativeSelect
              value={speciesId}
              onChange={(event) => setSpeciesId(event.target.value)}
            >
              {data.species.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.commonNameUk}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{m.kbAdmin.classifications}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {groups.map((group) => {
            const values = data.classificationValues.filter(
              (value) => value.groupId === group.id
            )
            return (
              <div key={group.id} className="flex flex-col gap-2">
                <p className="text-sm font-medium">
                  {group.nameUk}{" "}
                  <span className="text-muted-foreground">({group.type})</span>
                </p>
                <div className="flex flex-col gap-2">
                  {values.map((value) => {
                    const checked = linkedValues.has(value.id)
                    return (
                      <label
                        key={value.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          disabled={busy || !speciesId}
                          onCheckedChange={(next) =>
                            void onToggleClassification(
                              speciesId,
                              value.id,
                              next === true
                            )
                          }
                        />
                        {value.nameUk}
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{m.kbAdmin.diseases}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {data.diseases.map((row) => {
            const checked = linkedDiseases.has(row.id)
            return (
              <label key={row.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={checked}
                  disabled={busy || !speciesId}
                  onCheckedChange={(next) =>
                    void onToggleDisease(speciesId, row.id, next === true)
                  }
                />
                {row.nameUk}
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{m.kbAdmin.careImageUrl}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="/plants/tomato.svg"
              />
            </Field>
            <Button
              disabled={busy || !speciesId}
              onClick={() => {
                const careId =
                  care?.id ??
                  `kb_care_${speciesId.replace(/^kb_species_/, "")}`
                void onSaveCare({
                  id: careId,
                  speciesId,
                  imageUrl,
                  growing: care?.growing ?? {},
                  genetics: care?.genetics ?? {},
                  usage: care?.usage ?? {},
                })
              }}
            >
              {m.kbAdmin.save}
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
