import {
  FormControl,
  InputLabel,
  TextField,
  makeStyles,
  MenuItem,
  Select,
  Stack,
  Box,
  Typography,
  Theme,
} from '@mui/material'
import Item from './Item'
import { FC, useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../AppContext'
import { ZoneHumide } from '../..'
import { TYPES, TYPES_COLORS } from '../../constants'
import InfiniteScroll from 'react-infinite-scroller'
import InfiniteSelect from '@components/InfiniteSelect'

const types = Object.values(TYPES)

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
}

export interface Filters {
  name: string
  type: string
  bassin_versant: string
  communes: string
}

export interface Values {
  type: string[]
  bassin_versant: string[]
  communes: string[]
}

const initValues = {
  type: [],
  bassin_versant: [],
  communes: [],
}

const initPaginationValues = {
  page: -1,
  items: [],
  hasMore: true,
  itemsPerPage: 20,
}

const Search: FC = () => {
  const { results, geoJSON, filter, setFilter, setResults } =
    useContext(AppContext)
  const [values, setValues] = useState<Values>(initValues)
  const [pagination, setPagination] = useState(initPaginationValues)
  const scrollParentRef = useRef(null)

  const handleFilters = (value, property) => {
    const newFilter = {
      ...filter,
      [property]: value,
    }

    setFilter(newFilter)
  }

  useEffect(() => {
    const newValues = initValues
    for (const type of Object.keys(initValues)) {
      const all = ["communes"]
      newValues[type] = [
        ...new Set(
          geoJSON.features
            .map((f) => f.properties[type])
            .flat()
            .sort()
        ),
      ]
      newValues[type].unshift(all.includes(type) ? "Toutes" : "Tous")
    }

    setValues(newValues)
  }, [geoJSON])

  useEffect(() => {
    handleLoadMore(0)
  }, [results])

  useEffect(() => {
    let newResults = { ...geoJSON }

    if (filter.nom) {
      newResults.features = newResults.features.filter((f) => {
        return f.properties.nom
          ?.toLowerCase()
          .includes(filter.nom?.toLowerCase())
      })
    }

    if (filter.bassin_versant && filter.bassin_versant !== 'Tous') {
      newResults.features = newResults.features.filter((f) => {
        return f.properties.bassin_versant.includes(filter.bassin_versant)
      })
    }

    if (filter.communes && filter.communes !== 'Toutes') {
      newResults.features = newResults.features.filter((f) => {
        return f.properties.communes.includes(filter.communes)
      })
    }

    if (filter.type && filter.type !== 'Tous') {
      newResults.features = newResults.features.filter((f) => {
        return f.properties.type === filter.type
      })
    }

    setResults(newResults)
  }, [filter, geoJSON, setResults])

  const handleLoadMore = (page) => {
    if (!results.features.length) {
      return setPagination({
        ...initPaginationValues,
        hasMore: false,
      })
    }

    if (page > 0 && !pagination.hasMore) {
      return
    }

    const nextPage = page + 1
    const items = [
      ...(page > 0 ? pagination.items : []),
      ...results.features.slice(
        page * pagination.itemsPerPage,
        nextPage * pagination.itemsPerPage
      ),
    ]
    const hasMore = items.length < results.features.length

    setPagination({
      ...pagination,
      hasMore,
      items,
    })
  }

  return (
    <Box sx={styles.root}>
      <Stack
        ref={scrollParentRef}
        sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}
        spacing={1}
      >
        <TextField
          value={filter.nom}
          onChange={(e) => handleFilters(e.target.value, 'nom')}
          label="Chercher une ZH"
          fullWidth
        />
          <InfiniteSelect
              title = "Bassin(s) versant(s)"
              values={values.bassin_versant}
              defaultValue="Tous"
              value={filter.bassin_versant}
              onChange={(value) => {
                if (value) {
                  return handleFilters(value, 'bassin_versant')
                }
              }}
          ></InfiniteSelect>
          <InfiniteSelect
              title = "Commune(s)"
              defaultValue="Toutes"
              value={filter.communes}
              values={values.communes}
              onChange={(value) => {
                if (value) {
                  return handleFilters(value, 'communes')
                }
              }}
          ></InfiniteSelect>
          <FormControl fullWidth>
            <InputLabel>Type(s) de zone</InputLabel>
            <Select
              label="Type(s) de zone"
              value={filter.type}
              onChange={(e) => handleFilters(e.target.value, 'type')}
            >
              <MenuItem disabled value="all">
                Type de zone
              </MenuItem>
              {values.type.map((type) => (
                <MenuItem key={type} value={type}>
                  <Stack spacing={1} direction="row">
                    <Typography>{type}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography>{results.features.length} zones humides</Typography>
          <InfiniteScroll
            pageStart={pagination.page}
            hasMore={pagination.hasMore}
            loadMore={handleLoadMore}
            getScrollParent={() => scrollParentRef.current}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
            useWindow={false}
          >
            {pagination.items.map((result) => (
              <Item
                key={result.properties.id}
                value={result.properties as ZoneHumide}
              />
            ))}
          </InfiniteScroll>
      </Stack>
    </Box>
  )
}

export default Search
