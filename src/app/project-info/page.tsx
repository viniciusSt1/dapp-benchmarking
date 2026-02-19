'use client'

import { useState } from 'react';
import { Upload, X, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['DeFi', 'NFT', 'Gaming', 'DAO', 'Marketplace', 'Social', 'Infrastructure'];

export default function ProjectInfo() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DeFi');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!projectName.trim()) {
      toast.error('Por favor, insira o nome do projeto');
      return;
    }
    toast.success('Informações do projeto salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white mb-2">Informações do Projeto (APENAS FRONTEND AQUI, DAR UTILIDADE FUTURAMENTE)</h2>
        <p className="text-slate-400">Configure as informações básicas do seu dApp</p>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
        {/* Nome do dApp */}
        <div>
          <label className="block text-white mb-2">
            Nome do dApp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ex: UniSwap V3"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-white mb-2">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva seu dApp, suas funcionalidades e propósito..."
            rows={5}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
          />
          <p className="text-slate-500 mt-1">{description.length} caracteres</p>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-white mb-2">
            Categoria <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Logo */}
        <div>
          <label className="block text-white mb-2">Ícone/Logo</label>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {logoPreview ? (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-700">
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-slate-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                Escolher arquivo
              </label>
              <p className="text-slate-500 mt-2">
                PNG, JPG ou SVG. Tamanho recomendado: 512x512px
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Ex: swap, liquidity, AMM"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 text-white rounded-full"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Informações
          </button>
        </div>
      </div>
    </div>
  );
}
