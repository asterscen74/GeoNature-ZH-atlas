import { Button, Paper, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/dist/client/router'
import getConfig from 'next/config'
import { FC, useContext, useEffect, useState } from 'react'
import { AppContext } from '../AppContext'
import { ZoneHumide } from '../../index'
import Images from '../Images'
import FormItem from './Item'
import axios from 'axios'

const { publicRuntimeConfig } = getConfig()

const styles = {
  h6: {
    textAlign: 'center',
  },
}

const Form: FC = () => {
  const router = useRouter()
  const { feature } = useContext(AppContext)
  const [images, setImages] = useState([])
  const zoneHumide = feature.properties as ZoneHumide

  const fetchAndSetImages = async (id) => {
    const { data } = await axios
      .get(`${publicRuntimeConfig?.dependencies?.apiurl}/${id}/photos`)
      .catch(() => {
        //TODO: do it cleaner
        return { data: [] }
      })
    return setImages(data)
  }
  const handleOnBack = () => {
    router.push('/map')
  }

  useEffect(() => {
    if (feature.properties.id) {
      fetchAndSetImages(feature.properties.id)
    }
  }, [feature.properties.id])

  return (
    <Paper
      elevation={0}
      sx={{ height: '100%', p: 1, pb: 10, overflow: 'auto' }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleOnBack} fullWidth>
            Retour
          </Button>
          {zoneHumide.type_code != 14 &&
          <Button
            variant="outlined"
            href={`${publicRuntimeConfig?.dependencies?.pdf}/${zoneHumide.id}`}
            target="_blank"
            fullWidth
          >
            Télécharger fiche de synthèse
          </Button>
        }
        </Stack>
        <Images images={images} />
        {zoneHumide.code && (
          <Stack spacing={2}>
            <Typography variant="h6" sx={styles.h6}>
              {zoneHumide.code.toUpperCase()}{' '}
              {zoneHumide.nom.toLocaleUpperCase()}
            </Typography>
            <FormItem
              label="Bassin versant :"
              value={zoneHumide.bassin_versant[0]}
            />
            <FormItem
              label="Commune(s) :"
              value={zoneHumide.communes.join('\n')}
            ></FormItem>
            <FormItem label="Type de zone humide :" value={zoneHumide.type} />
            <FormItem
              label="Superficie (ha) :"
              value={(zoneHumide.superficie / 10000).toFixed(2)}
            />
            <FormItem
              label="Opérateur de l’inventaire :"
              value={zoneHumide.operateur}
            />
            <FormItem
              label="Date :"
              value={new Date(zoneHumide.date).toLocaleDateString('fr')}
            />
            <FormItem
              label="Critère(s) de délimitation :"
              value={zoneHumide.criteres_delim.join('\n')}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default Form
