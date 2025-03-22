import { CATEGORIES } from "@/constants/serviceConstants";
import { IUseBalanceGame } from "@/hooks/useBalanceGameList";
import {
  Box,
  Flex,
  Title,
  Group,
  Checkbox,
  TextInput,
  Button,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import React from "react";

const PcBalanceGameSearchArea = ({
  filters,
  handleDateChange,
  handleFilterChange,
  applySearch,
  handleCategoryChange,
}: IUseBalanceGame) => {
  return (
    <Box mb="xl" style={{ borderBottom: "1px solid gray" }} flex={1}>
      {/* 종료 여부 */}
      {/* 검색 */}
      <Flex my={"xl"}>
        <Box>
          <Title size="sm" mb={"md"}>
            마감일
          </Title>
          <Group>
            <DatePickerInput
              maxLevel="month"
              dropdownType="modal"
              name="startDate"
              valueFormat="YYYY-MM-DD"
              placeholder="날짜를 선택하세요."
              value={filters.startDate.toDate()}
              onChange={(v: any) => handleDateChange(v, "startDate")}
              locale="ko"
            />
            <Text>~</Text>
            <DatePickerInput
              name="endDate"
              maxLevel="month"
              dropdownType="modal"
              valueFormat="YYYY-MM-DD"
              placeholder="날짜를 선택하세요."
              value={filters.endDate.toDate()}
              onChange={(v: any) => handleDateChange(v, "endDate")}
              locale="ko"
            />
            <Checkbox
              flex={1}
              pl={"md"}
              name="showEnded"
              label="마감된 게임 포함"
              styles={{ label: { overflow: "hidden", flex: 1 } }}
              checked={filters.showEnded}
              onChange={handleFilterChange}
            />
          </Group>
        </Box>

        <Box flex={1} pl={"md"}>
          <Title size="sm" mb={"md"}>
            키워드 검색
          </Title>
          <Group>
            <TextInput
              flex={1}
              name="search"
              maw={250}
              min={150}
              placeholder="검색어를 입력하세요"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Button onClick={applySearch} flex={1} maw={200}>
              검색
            </Button>
          </Group>
        </Box>
      </Flex>

      {/* 카테고리 체크박스 */}
      <Title size="sm" w={500} mb={"md"}>
        카테고리
      </Title>
      <Flex wrap="wrap" align={"center"} mb={"xl"}>
        {CATEGORIES.map((category) => (
          <Checkbox
            value={category.value}
            key={category.value}
            label={category.label}
            checked={filters.categories.includes(category.value)}
            onChange={handleCategoryChange}
            mr={15}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default PcBalanceGameSearchArea;
