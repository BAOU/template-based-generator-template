import { useState, useEffect, useCallback } from 'react';
import { useDebouncedFn } from 'beautiful-react-hooks';
import { VFile } from 'vfile';
import type { JSONSchema7 } from 'json-schema';
// import { reporter } from 'vfile-reporter';
import { IConfiguration, templateFileToNLCSTNodes, getConfigSchemaFromTemplate, IOutputWIthMetadata, randomOutlineToArrayWithMetadataCompiler } from '../src';

function useTrigger() {
  const [a, f] = useState(false);
  return [
    useCallback(() => {
      f(!a);
    }, [a]),
    a,
  ] as const;
}

export function useTemplateGeneration(configFormData: IConfiguration | undefined) {
  const [template, templateSetter] = useState('');
  const [result, resultSetter] = useState<Array<IOutputWIthMetadata<any[]>>>([]);
  const [errorMessage, errorMessageSetter] = useState('');
  const [configSchema, configSchemaSetter] = useState<JSONSchema7 | undefined>();
  const [rerender, rerenderHookTrigger] = useTrigger();
  const parseAndGenerateFromTemplate = useDebouncedFn(
    (templateStringToParse: string): void => {
      const vFile = new VFile({ path: 'input.md', value: templateStringToParse });
      let newErrorMessage = '';
      try {
        const templateData = templateFileToNLCSTNodes(vFile);
        configSchemaSetter(getConfigSchemaFromTemplate(templateData));
        if (configFormData === undefined) {
          throw new Error('模板参数不正确');
        }
        resultSetter(randomOutlineToArrayWithMetadataCompiler(templateData, configFormData));
      } catch (e) {
        newErrorMessage += (e as Error).message;
      }
      // newErrorMessage += reporter(vFile);
      errorMessageSetter(newErrorMessage);
    },
    500,
    undefined,
    [configFormData],
  );
  useEffect(() => {
    parseAndGenerateFromTemplate(template);
  }, [template, rerenderHookTrigger]);

  return [rerender, template, templateSetter, result, configSchema, errorMessage] as const;
}
