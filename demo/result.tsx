import { Card, Elevation, Tag } from '@blueprintjs/core';
import styled from 'styled-components';
import React from 'react';
import { IOutputWIthMetadata } from '../src';

export enum ResultDisplayMode {
  share,
  paragraph,
  card,
}
const ResultContainer = styled(Card)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: 100vh;
  overflow: scroll;

  padding: 100px;
  font-size: 180px;
`;
const ResultParagraph = styled.p``;

export function ResultLine(props: { outputLine: IOutputWIthMetadata<any[]> }): JSX.Element {
  const { outputLine } = props;
  return (
    <Card elevation={Elevation.TWO}>
      <ResultParagraph>{outputLine.value}</ResultParagraph>
      {outputLine.metadata?.map((metadata, index) => (
        <Tag key={index}>{JSON.stringify(metadata)}</Tag>
      ))}
    </Card>
  );
}

export function GenerationResult(props: { result: Array<IOutputWIthMetadata<any[]>>; resultDisplayMode: ResultDisplayMode }): JSX.Element {
  switch (props.resultDisplayMode) {
    case ResultDisplayMode.card: {
      return (
        <ResultContainer>
          {props.result.map((outputLine, index) => (
            <ResultLine key={index} outputLine={outputLine} />
          ))}
        </ResultContainer>
      );
    }
    case ResultDisplayMode.share:
    case ResultDisplayMode.paragraph: {
      return (
        <ResultContainer as="article">
          {props.result.map((outputLine, index) => (
            <ResultParagraph key={index}>{outputLine.value}</ResultParagraph>
          ))}
        </ResultContainer>
      );
    }
  }
}
